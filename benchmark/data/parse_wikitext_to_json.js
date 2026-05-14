// parse_wikitext_to_json.js
// Node.js (no external deps)

const fs = require("fs");
const path = require("path");

/* ---------------- helpers ---------------- */

function unescapeWikiText(s) {
  if (!s) return "";
  let out = s.replace(/\\n/g, "\n");
  out = out.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
    String.fromCharCode(parseInt(h, 16))
  );
  out = out.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  return out;
}

function stripTemplates(text) {
  return text.replace(/\{\{[^}]+\}\}/g, "");
}

function stripFormatting(s) {
  return (s || "")
    .replace(/'''''/g, "")
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripWikiLinks(text) {
  // [[A|B]] -> B , [[A]] -> A
  return text.replace(/\[\[(.+?)\]\]/g, (_, inner) => {
    const parts = inner.split("|");
    return parts[1] ? parts[1].trim() : parts[0].trim();
  });
}

function extractAllWikiLinks(s) {
  const links = [];
  const re = /\[\[(.+?)\]\]/g;
  let m;
  while ((m = re.exec(s))) {
    const inner = m[1];
    const [title, display] = inner.split("|");
    links.push({
      title: title.trim(),
      display: stripFormatting((display || title).trim())
    });
  }
  return links;
}

function parseSection(line) {
  const m = line.match(/^==\s*(.+?)\s*==$/);
  return m ? m[1].trim() : null;
}

function parseBulletLine(line, section) {
  const raw = line.replace(/^\*\s*/, "").trim();

  // ลบ template เพื่อไม่ให้ {{USS|...}} ป่วนตอนหาคอมม่า/หัวข้อ
  const rawNoTpl = stripTemplates(raw);

  // 1) ดึง wikilink ทั้งหมดจาก "rawNoTpl" (ยังมี [[...]])
  const links = extractAllWikiLinks(rawNoTpl);

  // 2) description = หลัง comma ตัวแรก (ถ้ามี)
    let description = "";
  if (links.length > 0) {
    // หาตำแหน่งปิดของ wikilink แรกใน rawNoTpl
    const firstLinkEnd = rawNoTpl.indexOf("]]");
    const tail = firstLinkEnd !== -1 ? rawNoTpl.slice(firstLinkEnd + 2) : rawNoTpl;

    const commaIdx = tail.indexOf(",");
    if (commaIdx !== -1) {
      description = stripFormatting(stripWikiLinks(tail.slice(commaIdx + 1)));
    }
  } else {
    const commaIdx = rawNoTpl.indexOf(",");
    if (commaIdx !== -1) {
      description = stripFormatting(stripWikiLinks(rawNoTpl.slice(commaIdx + 1)));
    }
  }


  // 3) ถ้ามีลิงก์ -> เอาตัวแรกเป็นหัวข้อ
  if (links.length > 0) {
    return {
      section,
      // title = เป้าหมายของลิงก์ (เช่น "Rosa (plant)")
      title: stripFormatting(links[0].title),
      // display = ข้อความที่แสดง (เช่น "Rosa (plant)" หรือ "Kisses")
      display: stripFormatting(links[0].display),
      description
    };
  }

  // 4) ไม่มี wikilink -> fallback: ตัดหน้า comma แล้วล้าง formatting
  const head = stripFormatting(stripWikiLinks(rawNoTpl.split(",")[0]));
  if (!head) return null;

  return { section, title: head, display: head, description };
}


function extractFlatJSON(wikitext) {
  const lines = wikitext.split("\n");
  let currentSection = null;
  const out = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const sec = parseSection(line);
    if (sec) {
      currentSection = sec;
      continue;
    }

    if (line.startsWith("*")) {
      const item = parseBulletLine(line, currentSection);
      if (item) out.push(item);
    }
  }
  return out;
}



/* ---------------- flat pivot ---------------- */

function slugSection(s) {
  return (s || "unknown")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toFlatPivot(items, maxPerSection = 10) {
  const counters = {};
  const out = {};

  for (const it of items) {
    const sec = slugSection(it.section);
    counters[sec] = (counters[sec] || 0) + 1;
    const i = counters[sec];
    if (i > maxPerSection) continue;

    out[`${sec}_${i}_title`] = it.title || "";
    out[`${sec}_${i}_display`] = it.display || "";
    out[`${sec}_${i}_description`] = it.description || "";
  }
  return out;
}


/* ---------------- main ---------------- */

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: node parse_wikitext_to_json.js <input.txt> [output.json]");
  process.exit(1);
}

const baseName = path.basename(inputFile, path.extname(inputFile));
const pageTitle = baseName; // ประกาศให้มีจริง

// ถ้าผู้ใช้ส่ง output.json มา → ใช้เป็น base ของไฟล์แรก
// ส่วนไฟล์ flatpivot จะเติม suffix ต่อท้ายเอง
const outputFile =
  process.argv[3] || `${baseName}.json`;

const outputFile2 =
  process.argv[4] || `${baseName}__flatpivot.json`; // แยก argv[4] ชัดๆ

let text = fs.readFileSync(inputFile, "utf8");
text = unescapeWikiText(text);

const result = extractFlatJSON(text);

// 1) write array result (เหมือนเดิม)
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf8");

// 2) write payload (object เดียว) + flat pivot
const sectionSet = [...new Set(result.map(x => x.section).filter(Boolean))];
const payload = {
  title: pageTitle,
  page_type: "disambiguation",
  language: "en",
  raw_wikitext: text,
  sections_json: JSON.stringify(result),
  ...toFlatPivot(result, 10)
};

fs.writeFileSync(outputFile2, JSON.stringify(payload, null, 2), "utf8");

console.log(`Written ${result.length} records to ${outputFile}`);
console.log(`Written flatpivot payload to ${outputFile2}`);
