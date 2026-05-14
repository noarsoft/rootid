const fs = require('fs-extra');
const path = require('path');

/* ==========================================================================
   ส่วนที่ 1: Logic การตัดคำ (เหมือนเดิม ไม่เปลี่ยนแปลง)
   ========================================================================== */

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
    const rawNoTpl = stripTemplates(raw);
    const links = extractAllWikiLinks(rawNoTpl);

    let description = "";
    if (links.length > 0) {
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

    if (links.length > 0) {
        return {
            section,
            title: stripFormatting(links[0].title),
            display: stripFormatting(links[0].display),
            description
        };
    }

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

/* ==========================================================================
   ส่วนที่ 2: Main Execution Logic (ปรับแก้ตำแหน่ง data.json)
   ========================================================================== */

const OUTPUT_BASE_DIR = 'C:\\WorkPlace\\data\\results'; // can change the path to save

async function main() {
    // 1. รับ Input Directory จาก Command Line
    const inputDir = process.argv[2];
    if (!inputDir) {
        console.error("Usage: node process_revisions.js <path_to_input_json_folder>");
        console.error("Example: node process_revisions.js C:\\WorkPlace\\data\\json\\plant");
        process.exit(1);
    }

    // หาชื่อ Type จากชื่อโฟลเดอร์ท้ายสุด (เช่น 'plant')
    const typeName = path.basename(inputDir);
    const typeOutputDir = path.join(OUTPUT_BASE_DIR, typeName);

    console.log(`Processing Type: ${typeName}`);
    console.log(`Input Source: ${inputDir}`);
    console.log(`Output Dest:  ${typeOutputDir}`);

    try {
        // สร้างโฟลเดอร์ปลายทางสำหรับ Type นี้
        await fs.ensureDir(typeOutputDir);

        // อ่านรายการไฟล์ทั้งหมดใน input folder
        const files = await fs.readdir(inputDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        for (const file of jsonFiles) {
            const name = path.parse(file).name; // ชื่อไฟล์ไม่รวมนามสกุล (เช่น 'Rosa')
            const inputFilePath = path.join(inputDir, file);
            
            console.log(`\nReading: ${file}`);
            
            // อ่านไฟล์ JSON ต้นฉบับ
            const rawData = await fs.readJson(inputFilePath);
            
            // เจาะหา Revisions
            const pages = rawData.query?.pages;
            if (!pages) {
                console.warn(`  Skipping ${file}: Invalid structure (no query.pages)`);
                continue;
            }

            const pageId = Object.keys(pages)[0];
            const pageData = pages[pageId];
            const revisions = pageData.revisions;

            if (!revisions || revisions.length === 0) {
                console.warn(`  Skipping ${file}: No revisions found`);
                continue;
            }

            // สร้างโฟลเดอร์ย่อยตามชื่อ Name (เช่น .../results/plant/Rosa)
            const nameOutputDir = path.join(typeOutputDir, name);
            await fs.ensureDir(nameOutputDir);

            // =========================================================
            //  NEW: สร้างไฟล์ data.json ไว้ในโฟลเดอร์ย่อยนั้นๆ
            // =========================================================
            const dataMetadata = {
                name: name,
                raw: `https://en.wikipedia.org/wiki/${name}`,
                api: `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${name}&rvlimit=10&rvprop=ids|timestamp|user|comment|content&format=json`
            };
            
            const dataJsonPath = path.join(nameOutputDir, 'data.json');
            await fs.writeJson(dataJsonPath, dataMetadata, { spaces: 4 });
            console.log(`  -> Created metadata: data.json`);

            // วนลูป Process แต่ละ Revision
            for (const rev of revisions) {
                const revId = rev.revid;
                const wikitext = rev['*'] || ""; 
                
                const parsedResult = extractFlatJSON(wikitext);
                const flatPivotResult = toFlatPivot(parsedResult, 10);

                // สร้าง Object ผลลัพธ์รวม
                const finalOutput = {
                    revid: rev.revid,
                    parentid: rev.parentid,
                    user: rev.user,
                    timestamp: rev.timestamp,
                    contentformat: rev.contentformat,
                    contentmodel: rev.contentmodel,
                    comment: rev.comment,
                    normal: parsedResult, 
                    flatpivot: {
                        revid: rev.revid,
                        parentid: rev.parentid,
                        user: rev.user,
                        timestamp: rev.timestamp,
                        contentformat: rev.contentformat,
                        contentmodel: rev.contentmodel,
                        comment: rev.comment,
                        title: name.toLowerCase(),
                        page_type: "disambiguation",
                        language: "en",
                        raw_wikitext: wikitext,
                        sections_json: JSON.stringify(parsedResult),
                        ...flatPivotResult
                    }
                };

                // เขียนไฟล์แยกตาม Revision
                const outputFileName = `${name}_revid_${revId}.json`;
                const outputFilePath = path.join(nameOutputDir, outputFileName);
                
                await fs.writeJson(outputFilePath, finalOutput, { spaces: 2 });
            }
            console.log(`  -> Processed ${revisions.length} revisions`);
        }

        console.log(`\nSuccess! All files processed for type: ${typeName}`);

    } catch (err) {
        console.error("Critical Error:", err);
    }
}

main();