# Benchmark — รายละเอียดการทำงานทุกขั้นตอน

> เอกสารนี้อธิบาย benchmark ทุกส่วนว่าทำงานอย่างไร ตั้งแต่โหลด Wikipedia data จนถึง output
> อัพเดตล่าสุด: 2026-04-24

---

## 1. Input — Wikipedia Revision Data

**ไม่มี user input** — ใช้ข้อมูลจริงจาก Wikipedia API ทั้งหมด

| Parameter | ค่า | ที่มา |
|-----------|-----|-------|
| Categories | 58 | directory names ใน `data/json/` |
| Pages (articles) | 400 | JSON files (1 file = 1 article) |
| Revisions | 3,657 | revisions ทั้งหมดจากทุก article |
| Data size | ~252 MB | raw JSON จาก Wikipedia API |

**โครงสร้าง JSON จาก Wikipedia API:**
```json
{
  "query": {
    "pages": {
      "233488": {
        "pageid": 233488,
        "title": "Machine learning",
        "revisions": [
          {
            "revid": 1350530530,
            "parentid": 1350499899,
            "user": "Sprhodes",
            "timestamp": "2026-04-22T12:55:12Z",
            "comment": "...",
            "*": "{{Short description|...}} ..."
          }
        ]
      }
    }
  }
}
```

---

## 2. Wiki Data Loader (`wikiLoader.js`)

`loadWikiData(dataDir)` อ่านทุก category folder → ทุก JSON file → แปลง revision → return structured data

```js
loadWikiData(dataDir)
  → อ่านทุก category folder (58 folders)
  → อ่านทุก .json file (400 files)
  → แปลง revision → flat record
  → return { categories, pages, revisions, stats }
```

### Output:
- `categories[]` — 58 objects `{ name, date, time, date_time }`
- `pages[]` — 400 objects `{ rootid(=pageid), category, page_title, date, time, date_time }`
- `revisions[]` — 3,657 objects `{ rootid(=revid), prev_id(=parentid), pageid, username, timestamp, comment, content, date, time, date_time }`
- `stats` — `{ categories: 58, pages: 400, revisions: 3657, files: 400, totalSizeMB: 252 }`

### date/time/date_time — แปลงจาก Wikipedia timestamp

```
Wikipedia: "2025-07-15T04:56:15Z"
    → date:      20250715      (INTEGER)
    → time:      45615         (INTEGER — ไม่มี leading zero)
    → date_time: 20250715045615 (BIGINT — เกิน INT max 2,147,483,647)
```

---

## 3. Database Setup (สร้าง table/collection)

ทุกครั้งที่รัน จะ **DROP ก่อน → สร้างใหม่** ไม่มี data เก่าค้าง

### 3.1 PG Relational (3 normalized tables)

```sql
-- Table 1: bench_category (58 rows)
CREATE TABLE bench_category (
    id SERIAL PRIMARY KEY,
    rootid UUID UNIQUE DEFAULT gen_random_uuid(),
    prev_id INTEGER,
    name VARCHAR(100),
    date INTEGER,
    time INTEGER,
    date_time BIGINT
);

-- Table 2: bench_page (400 rows) — rootid = Wikipedia pageid
CREATE TABLE bench_page (
    id SERIAL PRIMARY KEY,
    rootid INTEGER UNIQUE NOT NULL,
    prev_id INTEGER,
    category_id INTEGER REFERENCES bench_category(id),
    page_title VARCHAR(500),
    date INTEGER,
    time INTEGER,
    date_time BIGINT
);

-- Table 3: bench_revision (3,657 rows) — rootid = revid, prev_id = parentid
CREATE TABLE bench_revision (
    id SERIAL PRIMARY KEY,
    rootid INTEGER UNIQUE NOT NULL,
    prev_id INTEGER,
    page_id INTEGER REFERENCES bench_page(id),
    username VARCHAR(255),
    timestamp VARCHAR(30),
    comment TEXT,
    content TEXT,
    date INTEGER,
    time INTEGER,
    date_time BIGINT
);
```

**Relation:** `bench_category (1) → (N) bench_page (1) → (N) bench_revision`

### 3.2 PG JSONB-only (1 flat table)

```sql
DROP TABLE IF EXISTS bench_jsonb;
CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}');
```

ข้อมูลทุก field ยัดรวมอยู่ใน **field `data` เป็น JSONB ก้อนเดียว**:
```json
{
  "rootid": 1300578444,
  "prev_id": 1283297281,
  "page_rootid": 22395556,
  "page_title": "Agricultural engineering",
  "category": "agricultural_science",
  "username": "Wikideas1",
  "timestamp": "2025-07-15T04:56:15Z",
  "comment": "/* See also */ ...",
  "content": "(12,601 chars wiki markup)",
  "date": 20250715,
  "time": 45615,
  "date_time": 20250715045615
}
```

### 3.3 MongoDB (1 flat collection)

```javascript
// drop collection เดิม
await col.drop().catch(() => {});
// ไม่ต้อง create — MongoDB สร้างอัตโนมัติตอน insert
```

ข้อมูลเก็บเป็น **document** (เหมือน JSONB):
```json
{"_id": ObjectId("..."), "_seq": 1, "rootid": 1300578444, "page_title": "Agricultural engineering", ...}
```

> `_seq` เป็น field ที่เราเพิ่มเอง (1, 2, 3, ...) เพื่อใช้หา row เฉพาะตอน UPDATE/DELETE ให้ fair กับ PG ที่มี `id SERIAL`

---

## 4. Flat Row Building (`buildFlatRows()`)

แปลง 3 arrays (categories, pages, revisions) → flat documents สำหรับ MongoDB และ PG JSONB:

```js
function buildFlatRows(categories, pages, revisions) {
  const pageMap = new Map();
  pages.forEach(p => pageMap.set(p.rootid, p));

  return revisions.map(rev => {
    const pg = pageMap.get(rev.pageid) || {};
    return {
      rootid: rev.rootid,        // = revid
      prev_id: rev.prev_id,      // = parentid
      page_rootid: rev.pageid,
      page_title: pg.page_title,
      category: pg.category,
      username: rev.username,
      timestamp: rev.timestamp,
      comment: rev.comment,
      content: rev.content,       // full wiki markup
      date: rev.date,
      time: rev.time,
      date_time: rev.date_time,
    };
  });
}
```

> data ชุดเดียวกันนี้ใช้กับทั้ง MongoDB และ PG JSONB เพื่อให้ fair

---

## 5. INSERT (bulk) — วัดเวลา insert

### 5.1 PG Relational (3 tables ตามลำดับ FK)

```
1. INSERT bench_category  (58 rows, 4 params/row)
2. SELECT id, name FROM bench_category → สร้าง catIdMap
3. INSERT bench_page (400 rows, 6 params/row) — ใช้ catIdMap หา category_id
4. SELECT id, rootid FROM bench_page → สร้าง pageIdMap
5. INSERT bench_revision (3,657 rows, 9 params/row) — ใช้ pageIdMap หา page_id
```

- PostgreSQL มีขีดจำกัด **65,535 parameters** ต่อ query
- batch size = `floor(65535 / params_per_row)`
  - category: floor(65535/4) = 16,383 rows/batch
  - page: floor(65535/6) = 10,922 rows/batch
  - revision: floor(65535/9) = 7,281 rows/batch

### 5.2 PG JSONB

```sql
INSERT INTO bench_jsonb (data)
VALUES ($1::jsonb), ($2::jsonb), ($3::jsonb), ...
```

- แต่ละ row ใช้ **1 parameter** (JSON string ทั้งก้อน)
- batch size = 65,535 rows (parameter 1 ตัวต่อ row)

### 5.3 MongoDB

```javascript
const docs = flatRows.map((row, i) => ({ _seq: i + 1, ...row }));
await col.insertMany(docs, { ordered: false });
```

- `insertMany` — ใส่ทีเดียวทั้ง 3,657 documents
- `ordered: false` — ไม่ต้องรอทีละตัว ใส่พร้อมกันได้ (เร็วกว่า)

---

## 6. SELECT * — วัดเวลาดึงข้อมูลทั้งหมด

| แบบ | Query |
|-----|-------|
| PG Relational | `SELECT r.*, p.page_title, p.rootid AS page_rootid, c.name AS category FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id` |
| PG JSONB | `SELECT * FROM bench_jsonb` |
| MongoDB | `col.find({}).toArray()` |

> PG Relational ต้อง JOIN 3 tables → ช้ากว่า flat query

---

## 7. SELECT filter (no index) — วัด full scan

ค้นหา revision ที่อยู่ใน category `'computer_science_research'` **โดยไม่มี index**

| แบบ | Query | การทำงานภายใน |
|-----|-------|--------------|
| PG Relational | `SELECT ... FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id WHERE c.name = $1` | JOIN + Sequential scan |
| PG JSONB | `SELECT * FROM bench_jsonb WHERE data->>'category' = $1` | Sequential scan — อ่านทุก row, แกะ JSONB, แล้ว check |
| MongoDB | `col.find({ category: filterCat }).toArray()` | Collection scan — อ่านทุก document แล้ว check |

---

## 8. CREATE INDEX (B-Tree) — วัดเวลาสร้าง index

สร้าง **B-Tree index** บน `category` ทั้ง 3 แบบ (ชนิดเดียวกัน → fair comparison)

| แบบ | Query | ชนิด index |
|-----|-------|-----------|
| PG Relational | `CREATE INDEX idx_bench_page_cat ON bench_page(category_id)` | B-Tree on FK |
| PG JSONB | `CREATE INDEX idx_bench_jsonb_btree ON bench_jsonb ((data->>'category'))` | Expression B-Tree |
| MongoDB | `col.createIndex({ category: 1 })` | B-Tree (WiredTiger) |

**PG JSONB ใช้ Expression B-Tree:**
- `(data->>'category')` = ดึงค่า `category` ออกจาก JSONB แล้วสร้าง B-Tree บนค่านั้น
- ทำให้เป็น B-Tree เหมือน PG Relational กับ MongoDB → เทียบได้ fair

---

## 9. SELECT filter (with B-Tree index) — วัด indexed query

Query เดียวกับข้อ 7 แต่ตอนนี้มี B-Tree index แล้ว

| แบบ | Query | การทำงานภายใน |
|-----|-------|--------------|
| PG Relational | (same JOIN + WHERE) | Index scan on category_id → O(log n) |
| PG JSONB | `SELECT * FROM bench_jsonb WHERE data->>'category' = $1` | Index scan → O(log n) |
| MongoDB | `col.find({ category: filterCat }).toArray()` | Index scan → O(log n) |

---

## 10. BONUS: GIN Index (เฉพาะ PG JSONB)

หลังทดสอบ B-Tree เสร็จ จะ **DROP B-Tree** แล้วสร้าง **GIN index** เพิ่มเติม:

```sql
-- ลบ B-Tree
DROP INDEX idx_bench_jsonb_btree;

-- สร้าง GIN
CREATE INDEX idx_bench_jsonb_gin ON bench_jsonb USING GIN(data);

-- Query ใช้ @> containment operator
SELECT * FROM bench_jsonb WHERE data @> $1::jsonb;
-- $1 = '{"category":"computer_science_research"}'
```

**ความแตกต่าง B-Tree vs GIN:**

| | B-Tree | GIN |
|--|--------|-----|
| Index อะไร | field เดียว (`category`) | ทุก key + value ใน JSONB |
| สร้าง | เร็ว | ช้ากว่า 3-10x |
| ขนาด | เล็ก | ใหญ่กว่า 4-7x |
| Query | `data->>'category' = $1` | `data @> $1::jsonb` |
| เหมาะกับ | รู้ว่าจะ query field ไหน | ไม่รู้ว่าจะ query field ไหน |

> เป็น bonus comparison — ไม่ใช้ในตารางหลัก เพราะเทียบกับ B-Tree ของ PG Relational / MongoDB ไม่ fair

---

## 11. UPDATE (1 row) — วัดเวลาแก้ 1 แถว

แก้ค่า `comment` ของ **row แรก** (id=1)

| แบบ | Query |
|-----|-------|
| PG Relational | `UPDATE bench_revision SET comment = 'updated_comment' WHERE id = 1` |
| PG JSONB | `UPDATE bench_jsonb SET data = data \|\| '{"comment":"updated_comment"}'::jsonb WHERE id = 1` |
| MongoDB | `col.updateOne({ _seq: 1 }, { $set: { comment: 'updated_comment' } })` |

**วิธี update แตกต่างกัน:**

### PG Relational
- แก้ column `comment` ตรงๆ
- PG ภายในสร้าง **tuple version ใหม่** (MVCC) — row เดิมถูก mark as dead

### PG JSONB
- `||` = merge JSONB — เอา `{"comment":"updated_comment"}` ไป merge กับ `data` เดิม
- ค่า `comment` ถูกเขียนทับ field อื่นไม่เปลี่ยน
- ภายในต้อง **deserialize JSONB เดิม → merge → serialize ใหม่**

### MongoDB
- `$set` = แก้เฉพาะ field `comment`
- ถ้า document size ไม่เปลี่ยน → **in-place update** (เร็วมาก)
- ถ้า size เปลี่ยน → ต้องย้าย document (ช้ากว่า)

---

## 12. DELETE (1 row) — วัดเวลาลบ 1 แถว

ลบ **row แรก** (id=1)

| แบบ | Query |
|-----|-------|
| PG Relational | `DELETE FROM bench_revision WHERE id = 1` |
| PG JSONB | `DELETE FROM bench_jsonb WHERE id = 1` |
| MongoDB | `col.deleteOne({ _seq: 1 })` |

**วิธี delete แตกต่างกัน:**

### PG Relational & PG JSONB
- PG ไม่ได้ลบจริง — แค่ **mark tuple as dead** (MVCC)
- ต้องรอ `VACUUM` มาทำความสะอาดทีหลัง
- เร็ว เพราะแค่ mark ไม่ต้อง rewrite

### MongoDB
- ลบ document ตรงๆ ออกจาก collection
- พื้นที่ว่างอาจถูก reuse โดย document ใหม่

---

## 13. Storage Measurement — วัดขนาดข้อมูล

### PG Relational (3 tables รวมกัน)

```sql
SELECT
    (pg_relation_size('bench_category') + pg_relation_size('bench_page') + pg_relation_size('bench_revision')) AS data,
    (pg_indexes_size('bench_category') + pg_indexes_size('bench_page') + pg_indexes_size('bench_revision')) AS idx,
    (pg_total_relation_size('bench_category') + pg_total_relation_size('bench_page') + pg_total_relation_size('bench_revision')) AS total
```

### PG JSONB (1 table)

```sql
SELECT pg_relation_size('bench_jsonb') AS data,
       pg_indexes_size('bench_jsonb') AS idx,
       pg_total_relation_size('bench_jsonb') AS total
```

| ค่า | ความหมาย |
|-----|---------|
| `data` | ขนาดข้อมูลจริง (ไม่รวม index) |
| `index` | ขนาด index ทั้งหมด (PK + B-Tree ที่สร้าง) |
| `total` | data + index + TOAST (JSONB/TEXT ที่ใหญ่มากจะถูกย้ายไป TOAST) |

### MongoDB

```javascript
const stats = await db.command({ collStats: 'bench_mongo' });
```

| ค่า | ความหมาย |
|-----|---------|
| `stats.size` | ขนาดข้อมูลจริง (uncompressed) |
| `stats.totalIndexSize` | ขนาด index ทั้งหมด (`_id` + index ที่สร้าง) |
| `stats.storageSize` | พื้นที่จริงบน disk (อาจ compressed) |

> PG JSONB วัด 2 ครั้ง: ครั้งแรกหลังสร้าง B-Tree (ใช้ในตารางหลัก), ครั้งที่สองหลังสร้าง GIN (ใช้ในตาราง bonus)

---

## 14. Timing — วิธีจับเวลา

ทุก operation ใช้ `performance.now()` ครอบ:

```javascript
async function timer(fn) {
  const start = performance.now();    // เริ่มจับเวลา (ความละเอียด microsecond)
  const result = await fn();          // รัน operation
  return {
    time: performance.now() - start,  // เวลาที่ใช้ (milliseconds)
    result
  };
}
```

- จับเวลา **ฝั่ง Node.js** (รวม network round-trip ไป DB + query execution)
- ไม่ได้วัดแค่ DB execution time แต่วัด **end-to-end** จาก application

---

## 15. Output — ผลลัพธ์

### 15.1 Console (แสดงทันที)

```
  EXECUTION TIME (all use B-Tree index)
  Operation           PG Relational   MongoDB         PG JSONB        Winner
  INSERT (bulk)       1234.00ms       987.00ms        1456.00ms       Mongo
  SELECT *            45.00ms         52.00ms         67.00ms         PG-Rel
  ...

  STORAGE SIZE (with B-Tree index)
  Metric              PG Relational   MongoDB         PG JSONB        Winner
  Data size           ...             ...             ...             ...
  Index size          ...             ...             ...             ...
  Total size          ...             ...             ...             ...

  BONUS: PG JSONB — GIN index vs Expression B-Tree
  ...
```

### 15.2 JSON (1 ไฟล์ต่อรอบ)

ชื่อไฟล์: `result_wiki_3657.json`

```json
{
  "execution_time_ms": {
    "insert": { "pg_relational": 1234, "mongodb": 987, "pg_jsonb": 1456 },
    "selectAll": { ... },
    ...
  },
  "storage_bytes": {
    "pg_relational": { "data": 0, "index": 0, "total": 0 },
    "mongodb": { ... },
    "pg_jsonb": { ... }
  },
  "bonus_jsonb_gin": {
    "createIndex_ms": 45,
    "selectIndexed_ms": 1.2,
    "storage": { "data": 0, "index": 0, "total": 0 }
  },
  "meta": {
    "categories": 58,
    "pages": 400,
    "revisions": 3657,
    "totalSizeMB": 252,
    "timestamp": "2026-04-23T..."
  }
}
```

### 15.3 CSV (สะสมทุกรอบ)

ชื่อไฟล์: `results.csv`
- รอบแรก: สร้างไฟล์ + เขียน header
- รอบถัดไป: **append แถวใหม่** ต่อท้าย (ไม่เขียนทับ)

```csv
categories,pages,revisions,timestamp,insert_pg,insert_mongo,insert_jsonb,...
58,400,3657,2026-04-23T...,1234.00,987.00,1456.00,...
```

### 15.4 HTML Report (สร้างจาก CSV)

```bash
node report.js    # อ่าน results.csv → สร้าง report.html
```

- แสดง per-operation execution time พร้อม bar chart
- เปรียบเทียบ storage size
- มี bonus GIN vs B-Tree section
- มีสี highlight winner

---

## 16. Flow Diagram

```
npm run bench  (node index.js)
       │
       ▼
┌─────────────────────────┐
│ 1. loadWikiData()       │  อ่าน 58 categories, 400 pages, 3,657 revisions
│ 2. buildFlatRows()      │  แปลง normalized → flat rows สำหรับ Mongo/JSONB
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    [1/3] PG Relational (3 tables)                │
│                                                                  │
│  DROP 3 tables → CREATE 3 tables                                │
│  → INSERT categories (58) → pages (400) → revisions (3,657)    │
│  → SELECT * (JOIN 3 tables)                                      │
│  → SELECT WHERE c.name = ? (no idx)                              │
│  → CREATE B-Tree INDEX on bench_page(category_id)                │
│  → SELECT WHERE c.name = ? (with idx)                            │
│  → UPDATE comment WHERE id = 1                                   │
│  → DELETE FROM bench_revision WHERE id = 1                       │
│  → pg_relation_size() (3 tables sum)                             │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    [2/3] MongoDB (flat docs)                      │
│                                                                  │
│  drop() → insertMany(3,657 docs)                                │
│  → find({}) → find({ category: ? })                              │
│  → createIndex({ category: 1 })                                 │
│  → find({ category: ? })                                        │
│  → updateOne({ _seq: 1 }) → deleteOne({ _seq: 1 })             │
│  → collStats                                                     │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    [3/3] PG JSONB (flat docs)                     │
│                                                                  │
│  DROP TABLE → CREATE TABLE (id + data JSONB)                    │
│  → INSERT 3,657 rows                                             │
│  → SELECT * → SELECT WHERE data->>'category' = ? (no idx)      │
│                                                                  │
│  Phase 1 — B-Tree (ใช้ในตารางหลัก):                               │
│  → CREATE Expression B-Tree INDEX → SELECT → วัด storage         │
│                                                                  │
│  Phase 2 — GIN (bonus):                                          │
│  → DROP B-Tree → CREATE GIN INDEX → SELECT @> → วัด storage     │
│                                                                  │
│  → UPDATE data || jsonb → DELETE                                 │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Print console table │
│ Save JSON           │  result_wiki_3657.json (เขียนทับ)
│ Append CSV          │  results.csv (append แถวใหม่)
└─────────────────────┘
           │
           ▼ (แยกสั่งเอง)
┌─────────────────────┐
│ node report.js      │  อ่าน results.csv → สร้าง report.html
└─────────────────────┘
```

---

## 17. สิ่งที่ทั้ง 3 แบบทำเหมือนกัน (ทำให้ fair)

| เงื่อนไข | รายละเอียด |
|---------|-----------|
| Data เดียวกัน | Wikipedia data ชุดเดียวกันใช้กับทั้ง 3 |
| Filter value เดียวกัน | ใช้ `'computer_science_research'` ทั้ง 3 |
| Index ชนิดเดียวกัน | B-Tree ทั้ง 3 (ตารางหลัก) |
| UPDATE/DELETE row เดียวกัน | row แรก (id=1 / _seq=1) |
| วัดเวลาแบบเดียวกัน | `performance.now()` ทั้ง 3 |
| เครื่องเดียวกัน | localhost ทั้ง PG และ MongoDB |

---

## 18. สิ่งที่ต่างกัน (ตามธรรมชาติของแต่ละ DB)

| PG Relational (3 tables) | PG JSONB (1 table) | MongoDB (1 collection) |
|--------------------------|--------------------|-----------------------|
| 3 normalized tables + FK | JSONB ก้อนเดียว | BSON document |
| SELECT ต้อง JOIN 3 tables | SELECT flat table | find flat collection |
| INSERT ตามลำดับ FK | INSERT 1 param/row | insertMany |
| UPDATE SET col = val | UPDATE data \|\| jsonb (merge) | $set field |
| DELETE mark dead (MVCC) | DELETE mark dead (MVCC) | ลบจริง |
| B-Tree บน FK column | Expression B-Tree บน data->>'col' | B-Tree (WiredTiger) |
| pg_relation_size() × 3 | pg_relation_size() × 1 | collStats |
