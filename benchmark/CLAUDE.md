# DB Benchmark — Architecture & Flow Guide

> อัปเดตล่าสุด: 2026-04-27
> รวมจาก flow.md + BENCHMARK-DETAIL.md + BENCHMARK-PLAN.md

---

## 1. ภาพรวม

Benchmark เปรียบเทียบ **PG Relational vs MongoDB vs PG JSONB** ใช้ Wikipedia revision data จริง

- **Stack**: Express :3003 → PostgreSQL 18 + MongoDB 8
- **Data**: 58 categories, ~400 pages, ~3,657 revisions, ~252 MB
- **No user input**: กดปุ่ม Run อย่างเดียว

```
Browser (BenchmarkPage.jsx)
    │ POST /api/benchmark/run
    ▼
Express @ :3003 (server.js)
    │
    ▼
benchCore.js
    ├─ loadWikiData()          ← wikiLoader.js
    ├─ buildFlatRows()
    ├─ benchPgRelational()  ─┐
    ├─ benchMongo()         ─┤ sequential
    ├─ benchPgJsonb()       ─┘
    └─ buildResult()
    │
    ▼
PostgreSQL 5432  +  MongoDB 27017
```

---

## 2. วิธีรัน

```bash
cd rootid/benchmark
npm install                    # ครั้งแรก
docker compose up -d           # PG 18 + Mongo 8
npm start                      # http://localhost:3003 แล้วกด Run
```

**ต้องการ**: Docker (PG port 5432, Mongo port 27017)

---

## 3. Code Map

| ไฟล์ | หน้าที่ |
|------|---------|
| `wikiLoader.js` | โหลด Wikipedia JSON → `{ categories[], pages[], revisions[], stats }` |
| `benchCore.js` | Core: `runBenchmark()`, `getStatus()`, 3 bench functions, `timer()`, `buildFlatRows()` |
| `server.js` | Express API server (2 endpoints, port 3003) |
| `index.js` | CLI runner (`node index.js` รันจาก terminal) |
| `fetchWikiData.js` | ดึง Wikipedia data จาก API |

---

## 4. Wikipedia Data Structure

**ไม่มี user input** — ใช้ข้อมูลจริงจาก Wikipedia API

| Parameter | ค่า | ที่มา |
|-----------|-----|-------|
| Categories | 58 | directory names ใน `data/json/` |
| Pages | ~400 | JSON files (1 file = 1 article) |
| Revisions | ~3,657 | revisions ทั้งหมดจากทุก article |
| Data size | ~252 MB | raw JSON จาก Wikipedia API |

### wikiLoader output

- `categories[]` — 58 objects `{ name, date, time, date_time }`
- `pages[]` — ~400 objects `{ rootid(=pageid), category, page_title, date, time, date_time }`
- `revisions[]` — ~3,657 objects `{ rootid(=revid), prev_id(=parentid), pageid, username, timestamp, comment, content, date, time, date_time }`

### date/time แปลงจาก Wikipedia timestamp

```
Wikipedia: "2025-07-15T04:56:15Z"
    → date:      20250715      (INTEGER)
    → time:      45615         (INTEGER)
    → date_time: 20250715045615 (BIGINT)
```

---

## 5. Database Schemas

ทุกครั้งที่รัน **DROP ก่อน → สร้างใหม่**

### 5.1 PG Relational (3 normalized tables)

```sql
CREATE TABLE bench_category (
    id SERIAL PRIMARY KEY,
    rootid UUID UNIQUE DEFAULT gen_random_uuid(),
    prev_id INTEGER,
    name VARCHAR(100),
    date INTEGER, time INTEGER, date_time BIGINT
);

CREATE TABLE bench_page (
    id SERIAL PRIMARY KEY,
    rootid INTEGER UNIQUE NOT NULL,
    prev_id INTEGER,
    category_id INTEGER REFERENCES bench_category(id),
    page_title VARCHAR(500),
    date INTEGER, time INTEGER, date_time BIGINT
);

CREATE TABLE bench_revision (
    id SERIAL PRIMARY KEY,
    rootid INTEGER UNIQUE NOT NULL,
    prev_id INTEGER,
    page_id INTEGER REFERENCES bench_page(id),
    username VARCHAR(255),
    timestamp VARCHAR(30),
    comment TEXT, content TEXT,
    date INTEGER, time INTEGER, date_time BIGINT
);
```

**Relation:** `bench_category (1) → (N) bench_page (1) → (N) bench_revision`

### 5.2 PG JSONB (1 flat table)

```sql
CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}');
```

### 5.3 MongoDB (1 flat collection)

`insertMany` flat documents — เหมือน JSONB แต่มี `_seq` field สำหรับ UPDATE/DELETE

---

## 6. Benchmark Operations (7 ops + GIN bonus)

ทั้ง 3 แบบทำ 7 operations เหมือนกัน ทุกอันวัดด้วย `timer()`:

| # | Operation | PG Relational | PG JSONB | MongoDB |
|---|-----------|--------------|----------|---------|
| 1 | INSERT (bulk) | 3 tables ตามลำดับ FK | 1 param/row | insertMany |
| 2 | SELECT * | JOIN 3 tables | flat scan | find({}) |
| 3 | SELECT filter (no idx) | JOIN + WHERE c.name=? | data->>'category'=? | find({category:?}) |
| 4 | CREATE INDEX (B-Tree) | bench_page(category_id) | ((data->>'category')) | {category:1} |
| 5 | SELECT filter (indexed) | same JOIN with index | same query with index | same find with index |
| 6 | UPDATE (1 row) | SET comment=? WHERE id=1 | data \|\| jsonb WHERE id=1 | $set {comment:?} |
| 7 | DELETE (1 row) | DELETE WHERE id=1 | DELETE WHERE id=1 | deleteOne({_seq:1}) |

**BONUS (PG JSONB only):** DROP B-Tree → CREATE GIN index → SELECT with @> containment

### B-Tree vs GIN

| | B-Tree | GIN |
|--|--------|-----|
| Index อะไร | field เดียว (category) | ทุก key+value ใน JSONB |
| สร้าง | เร็ว | ช้ากว่า 3-10x |
| ขนาด | เล็ก | ใหญ่กว่า 4-7x |
| Query | `data->>'category' = $1` | `data @> $1::jsonb` |

---

## 7. timer() — วัดอะไร, ไม่วัดอะไร

```js
async function timer(fn) {
  const start = performance.now();
  const result = await fn();
  return { time: performance.now() - start, result };
}
```

**วัด**: Query execution, driver overhead, network hop (localhost)
**ไม่วัด**: loadWikiData, buildFlatRows, connect, DROP/CREATE TABLE, storage queries, buildResult

---

## 8. Storage Measurement

| แบบ | วิธีวัด |
|-----|---------|
| PG Relational | `pg_relation_size()` + `pg_indexes_size()` รวม 3 tables |
| PG JSONB | `pg_relation_size('bench_jsonb')` — วัด 2 ครั้ง (B-Tree + GIN) |
| MongoDB | `db.command({ collStats })` → size, totalIndexSize, storageSize |

---

## 9. Execution Sequence

```
time ──────────────────────────────────►

  loadWikiData()      ← overhead
  buildFlatRows()     ← overhead
  connect PG + Mongo  ← overhead
       │
  benchPgRelational() → 7 ops measured
       │
  benchMongo()        → 7 ops measured
       │
  benchPgJsonb()      → 7 ops + GIN bonus measured
       │
  buildResult() → HTTP response → FE render
```

**ทำไม sequential**: ป้องกัน PG กับ Mongo แย่ง CPU/IO กัน

---

## 9.1 กดปุ่ม Run Benchmark แล้วเกิดอะไร (End-to-End Flow)

```
[Browser]  กดปุ่ม "▶ Run Benchmark"
    │
    │  1. ปุ่ม disabled + แสดง spinner "Running benchmark (10-60 seconds)..."
    │  2. POST /api/benchmark/run (ไม่ส่ง body)
    │
    ▼
[Express server.js :3003]
    │
    │  3. เช็คว่ามี benchmark กำลังรันอยู่มั้ย (ถ้ามี → 409 error)
    │  4. เรียก runBenchmark() จาก benchCore.js
    │
    ▼
[benchCore.js — runBenchmark()]
    │
    │  ── ไม่จับเวลา ──────────────────────────────
    │  5. loadWikiData()     อ่าน JSON จาก data/json/
    │     → 58 categories, 399 pages, 3,657 revisions
    │  6. buildFlatRows()   แปลง revision เป็น flat row
    │     → เพิ่ม category, page_title เข้าทุก revision
    │  7. connect PG (port 5432) + Mongo (port 27017)
    │
    │  ── จับเวลาด้วย timer() ─────────────────────
    │  8. benchPgRelational()  ← DROP 3 tables → CREATE → 7 ops
    │     ├─ INSERT: 3 tables ตามลำดับ FK (category→page→revision)
    │     ├─ SELECT *: JOIN 3 tables
    │     ├─ SELECT filter: WHERE category='computer_science_research'
    │     ├─ CREATE INDEX: B-Tree on bench_page(category_id)
    │     ├─ SELECT indexed: same query หลังมี index
    │     ├─ UPDATE: SET comment WHERE id=1
    │     ├─ DELETE: WHERE id=1
    │     └─ วัด storage (pg_relation_size + pg_indexes_size)
    │
    │  9. benchMongo()  ← DROP collection → 7 ops
    │     ├─ INSERT: insertMany flat documents
    │     ├─ SELECT *: find({})
    │     ├─ SELECT filter: find({category:'computer_science_research'})
    │     ├─ CREATE INDEX: {category:1}
    │     ├─ SELECT indexed: same find หลังมี index
    │     ├─ UPDATE: $set {comment} on _seq=1
    │     ├─ DELETE: deleteOne({_seq:1})
    │     └─ วัด storage (collStats)
    │
    │  10. benchPgJsonb()  ← DROP table → CREATE → 7 ops + GIN bonus
    │     ├─ INSERT: flat JSONB rows
    │     ├─ SELECT *: flat scan
    │     ├─ SELECT filter: data->>'category'='computer_science_research'
    │     ├─ CREATE INDEX: B-Tree on ((data->>'category'))
    │     ├─ SELECT indexed: same query หลังมี index
    │     ├─ UPDATE: data || jsonb WHERE id=1
    │     ├─ DELETE: WHERE id=1
    │     ├─ วัด storage (B-Tree)
    │     ├─ BONUS: DROP B-Tree → CREATE GIN → SELECT @> containment
    │     └─ วัด storage (GIN)
    │
    │  11. buildResult()  รวมผลทั้ง 3 แบบเป็น JSON
    │
    ▼
[Express server.js]
    │
    │  12. บันทึกผล:
    │     ├─ results.csv      ← append แถวใหม่ (สะสมทุกรอบ)
    │     └─ result_wiki_3657.json ← เขียนทับทุกรอบ
    │  13. ส่ง JSON กลับ { success: true, data: {...} }
    │
    ▼
[Browser — benchmark.html]
    │
    │  14. ซ่อน spinner, enable ปุ่ม Run
    │  15. แสดง Stats Grid (Categories, Pages, Revisions, Data Size)
    │  16. renderResults() สร้าง 2 charts ด้วย Chart.js:
    │     ├─ Execution Time (ms) — horizontal bar, log scale
    │     │   เทียบ 7 ops ของ 3 แบบ (สีฟ้า/เขียว/เหลือง)
    │     └─ Storage Size (MB) — vertical bar
    │         เทียบ Data/Index/Total ของ 3 แบบ
    │
    └─ เสร็จ — user เห็นผลเปรียบเทียบ
```

### ใช้เวลาเท่าไหร่?

| ขั้นตอน | เวลาโดยประมาณ |
|---------|--------------|
| loadWikiData (อ่าน 252 MB JSON) | 3-8 วินาที |
| benchPgRelational (INSERT 3 tables) | 5-20 วินาที |
| benchMongo (insertMany) | 3-10 วินาที |
| benchPgJsonb (INSERT + GIN) | 5-15 วินาที |
| **รวมทั้งหมด** | **~15-60 วินาที** |

> INSERT เป็น operation ที่ช้าสุดเพราะ content column ใหญ่ (~252 MB)
> รอบแรกจะช้ากว่าเพราะ cold cache — รัน 2-3 ครั้งแล้วเปรียบเทียบ

---

## 10. API Contract

### GET `/api/benchmark/status`

```json
{
  "success": true,
  "data": {
    "postgres": true, "pgVersion": "18.x",
    "mongodb": true, "mongoVersion": "8.x",
    "wikiData": { "categories": 58, "pages": 399, "revisions": 3657, "totalSizeMB": 252 }
  }
}
```

### POST `/api/benchmark/run`

ไม่ต้องส่ง body → return `{ success, data: { execution_time_ms, storage_bytes, bonus_jsonb_gin, meta } }`

---

## 11. Output Formats

| Format | ไฟล์ | คำอธิบาย |
|--------|------|---------|
| Console | - | ตาราง execution time + storage + winner |
| JSON | `result_wiki_3657.json` | เขียนทับทุกรอบ |
| CSV | `results.csv` | append แถวใหม่ทุกรอบ |
| HTML | `report.html` | `node report.js` อ่าน CSV → สร้าง charts |

---

## 12. Fairness — ทำให้เทียบกันได้

| เงื่อนไข | รายละเอียด |
|---------|-----------|
| Data เดียวกัน | Wikipedia data ชุดเดียวกันทั้ง 3 |
| Filter value เดียวกัน | `'computer_science_research'` |
| Index ชนิดเดียวกัน | B-Tree ทั้ง 3 (ตารางหลัก) |
| UPDATE/DELETE row เดียวกัน | row แรก (id=1 / _seq=1) |
| วัดเวลาแบบเดียวกัน | `performance.now()` |
| Sequential | ไม่แย่ง resource |

---

## 13. Troubleshooting

| อาการ | เช็คอะไร |
|-------|----------|
| FE ขึ้น "ต่อ Benchmark API ไม่ได้" | `npm start` ยังรันอยู่? port 3003 |
| Status → PG offline | PG รัน port 5432? ตรวจ .env |
| Status → Mongo offline | `mongosh --eval 'db.runCommand({ping:1})'` |
| INSERT ช้ามาก | content column ใหญ่ — ปกติ |
| Run แรกช้า | Cold cache — รัน 2-3 ครั้งแล้วเปรียบเทียบ |

---

## Communication Rules
- ตอบตรงๆ ไม่อวย
- สงสัยก็ถาม
- แนะนำ 3 ข้อ
- ไม่มีก็บอกไม่มี
