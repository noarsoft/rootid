# DB Benchmark — Flow & Evaluation Guide

เอกสารเดียวจบ อ่านแล้วเข้าใจว่า benchmark ทำงานยังไง step-by-step ตั้งแต่กดปุ่มจนเห็นผล, timer วัดตรงไหน, อะไรเป็น overhead

---

## 0. TL;DR — 30 วินาที

- **Real benchmark** — ยิง SQL/Mongo queries จริง วัดด้วย `performance.now()`
- **Data**: Wikipedia revision data (58 categories, ~400 pages, ~58K revisions, ~100MB)
- **3-way comparison**: PG Relational (3 normalized tables + JOIN) vs MongoDB (flat docs) vs PG JSONB (flat docs)
- **Bonus**: GIN index vs Expression B-Tree สำหรับ JSONB
- **Stack**: React Vite → HTTP → Express :3003 → PostgreSQL + MongoDB
- **No user input**: กดปุ่มเดียว ไม่ต้องตั้ง N/K/M — ใช้ wiki data ทั้งหมด

---

## 1. Architecture

```
┌──────────────────────────────────────────────────────┐
│ Browser                                              │
│                                                      │
│  BenchmarkPage.jsx                                   │
│   ├─ "Run Benchmark" button                          │
│   ├─ fetch POST /api/benchmark/run (no body)         │
│   └─ render: 3-way charts + storage + GIN bonus      │
└──────────────┬───────────────────────────────────────┘
               │ HTTP JSON
               ▼
┌──────────────────────────────────────────────────────┐
│ Express @ :3003 (server.js)                          │
│                                                      │
│  GET  /api/benchmark/status  → getStatus()           │
│  POST /api/benchmark/run     → runBenchmark()        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│ benchCore.js (core logic)                            │
│                                                      │
│  runBenchmark()                                      │
│    ├─ loadWikiData()          ← wikiLoader.js        │
│    ├─ buildFlatRows()         ← denormalize          │
│    ├─ ensurePgDatabase()                             │
│    ├─ connect PG + Mongo                             │
│    ├─ benchPgRelational()  ─┐                        │
│    ├─ benchMongo()         ─┤ sequential             │
│    ├─ benchPgJsonb()       ─┘                        │
│    └─ buildResult()                                  │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
      PostgreSQL 5432  +  MongoDB 27017
```

---

## 2. Code Map — ไฟล์ไหนทำอะไร

| ไฟล์ | หน้าที่ |
|------|---------|
| `wikiLoader.js` | โหลด Wikipedia JSON → `{ categories[], pages[], revisions[], stats }` |
| `benchCore.js` | Core: `runBenchmark()`, `getStatus()`, 3 bench functions, `timer()`, `buildFlatRows()` |
| `server.js` | Express API server (2 endpoints, port 3003) |
| `index.js` | CLI runner (ใช้ `node index.js` รันจาก terminal) |
| `BenchmarkPage.jsx` | React UI: กดรัน, แสดง chart/table/storage/GIN bonus |

---

## 3. Step-by-Step Flow — กดปุ่ม "Run Benchmark" จนเห็นผล

### Step 1: FE — กดปุ่ม

```
BenchmarkPage.jsx → runBenchmark callback
├─ setLoading(true)
├─ setError(null)
└─ fetch POST http://localhost:3003/api/benchmark/run (no body)
```

### Step 2: Server — รับ request

```
server.js L24
├─ POST /api/benchmark/run
└─ calls runBenchmark() from benchCore.js
```

### Step 3: Load Wikipedia Data (OVERHEAD)

```
benchCore.js → runBenchmark() L382–385
├─ loadWikiData(DATA_DIR)                    ← wikiLoader.js
│   ├─ อ่าน 58 category folders จาก data/json/
│   ├─ parse ทุก .json file (Wikipedia API response)
│   ├─ extract: categories (58), pages (~400), revisions (~58K)
│   └─ parseDateTime() แปลง ISO → date/time/date_time integers
├─ buildFlatRows(categories, pages, revisions)
│   ├─ join 3-level data → flat docs สำหรับ Mongo/JSONB
│   └─ return revisions.map(rev → { ...rev, page_title, category })
└─ output: categories[], pages[], revisions[], flatRows[], stats
```

**❌ ไม่ได้วัด** — เป็นการเตรียม data ก่อน benchmark

### Step 4: Connect Databases (OVERHEAD)

```
benchCore.js L387–394
├─ ensurePgDatabase()    ← สร้าง PG database ถ้ายังไม่มี
├─ new Client(PG_URL)    → pgClient.connect()
└─ new MongoClient(MONGO_URL) → mongoClient.connect() → mongoDB
```

**❌ ไม่ได้วัด** — setup ครั้งเดียว

### Step 5: Benchmark #1 — PG Relational (3 tables + JOIN)

```
benchCore.js → benchPgRelational(pg, categories, pages, revisions) L60–219

❌ OVERHEAD: DROP + CREATE 3 tables
├─ DROP TABLE bench_revision, bench_page, bench_category
├─ CREATE TABLE bench_category (id, rootid UUID, prev_id, name, date, time, date_time)
├─ CREATE TABLE bench_page (id, rootid INT, prev_id, category_id FK, page_title, date, time, date_time)
└─ CREATE TABLE bench_revision (id, rootid INT, prev_id, page_id FK, username, timestamp, comment, content, date, time, date_time)

✅ EVALUATION: 7 operations wrapped in timer()

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Op 1: INSERT (bulk)                                                            │
│ timer() L108–161                                                               │
│ ├─ INSERT categories (58 rows, 4 cols each, single query)                      │
│ ├─ SELECT id,name FROM bench_category → catIdMap                               │
│ ├─ INSERT pages (batched, max 65535/6 = 10922 rows/batch)                      │
│ ├─ SELECT id,rootid FROM bench_page → pageIdMap                                │
│ └─ INSERT revisions (batched, max 65535/9 = 7281 rows/batch)                   │
│ Note: รวม SELECT id→map ไว้ใน timer ด้วย (ต้องมีเพื่อ FK mapping)             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 2: SELECT * (JOIN 3 tables)                                                 │
│ timer() L164–169                                                               │
│ SELECT r.*, p.page_title, p.rootid AS page_rootid, c.name AS category          │
│ FROM bench_revision r                                                          │
│ JOIN bench_page p ON r.page_id = p.id                                          │
│ JOIN bench_category c ON p.category_id = c.id                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 3: SELECT filter (no index)                                                 │
│ timer() L173–179                                                               │
│ ...WHERE c.name = 'computer_science_research'                                  │
│ (full scan — ยังไม่มี index บน category_id)                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 4: CREATE INDEX                                                             │
│ timer() L182–184                                                               │
│ CREATE INDEX idx_bench_page_cat ON bench_page(category_id)                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 5: SELECT filter (indexed)                                                  │
│ timer() L187–194                                                               │
│ ...WHERE c.name = 'computer_science_research'  (same query, now with index)    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 6: UPDATE (1 row)                                                           │
│ timer() L196–198                                                               │
│ UPDATE bench_revision SET comment = 'updated_comment' WHERE id = 1             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 7: DELETE (1 row)                                                           │
│ timer() L201–203                                                               │
│ DELETE FROM bench_revision WHERE id = 1                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

❌ OVERHEAD: Storage measurement (ไม่อยู่ใน timer)
├─ pg_relation_size('bench_category') + bench_page + bench_revision → data bytes
├─ pg_indexes_size('bench_category') + bench_page + bench_revision → index bytes
└─ pg_total_relation_size ทั้ง 3 → total bytes
```

### Step 6: Benchmark #2 — MongoDB (flat docs)

```
benchCore.js → benchMongo(db, flatRows) L307–347

❌ OVERHEAD: DROP collection
└─ col.drop()

✅ EVALUATION: 7 operations wrapped in timer()

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Op 1: INSERT (bulk)                                                            │
│ timer() L312–315                                                               │
│ col.insertMany(flatRows.map((row,i) → { _seq: i+1, ...row }), {ordered:false})│
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 2: SELECT * (full scan)                                                     │
│ timer() L318                                                                   │
│ col.find({}).toArray()                                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 3: SELECT filter (no index)                                                 │
│ timer() L322                                                                   │
│ col.find({ category: 'computer_science_research' }).toArray()                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 4: CREATE INDEX                                                             │
│ timer() L325                                                                   │
│ col.createIndex({ category: 1 })                                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 5: SELECT filter (indexed)                                                  │
│ timer() L328                                                                   │
│ col.find({ category: 'computer_science_research' }).toArray()                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 6: UPDATE (1 row)                                                           │
│ timer() L331–333                                                               │
│ col.updateOne({ _seq: 1 }, { $set: { comment: 'updated_comment' } })           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 7: DELETE (1 row)                                                           │
│ timer() L336                                                                   │
│ col.deleteOne({ _seq: 1 })                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

❌ OVERHEAD: Storage measurement
└─ db.command({ collStats: 'bench_mongo' }) → size, totalIndexSize, storageSize
```

### Step 7: Benchmark #3 — PG JSONB (flat docs)

```
benchCore.js → benchPgJsonb(pg, flatRows) L221–305

❌ OVERHEAD: DROP + CREATE table
├─ DROP TABLE bench_jsonb
└─ CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}')

✅ EVALUATION: 7 operations + GIN bonus wrapped in timer()

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Op 1: INSERT (bulk)                                                            │
│ timer() L228–238                                                               │
│ INSERT INTO bench_jsonb (data) VALUES ($1::jsonb), ($2::jsonb), ...            │
│ (batched, max 65535 rows/batch since 1 param per row)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 2: SELECT * (full scan)                                                     │
│ timer() L241                                                                   │
│ SELECT * FROM bench_jsonb                                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 3: SELECT filter (no index)                                                 │
│ timer() L245–247                                                               │
│ SELECT * FROM bench_jsonb WHERE data->>'category' = $1                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 4: CREATE INDEX (B-Tree)                                                    │
│ timer() L250–252                                                               │
│ CREATE INDEX idx_bench_jsonb_btree ON bench_jsonb ((data->>'category'))         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 5: SELECT filter (B-Tree indexed)                                           │
│ timer() L255–257                                                               │
│ SELECT * FROM bench_jsonb WHERE data->>'category' = $1                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 6: UPDATE (1 row)                                                           │
│ timer() L294–298                                                               │
│ UPDATE bench_jsonb SET data = data || $1::jsonb WHERE id = 1                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Op 7: DELETE (1 row)                                                           │
│ timer() L301                                                                   │
│ DELETE FROM bench_jsonb WHERE id = 1                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ BONUS: GIN index comparison                                                    │
│ ├─ DROP B-Tree index first                                                     │
│ ├─ timer() L273–275: CREATE INDEX ... USING GIN(data)                          │
│ ├─ timer() L278–280: SELECT ... WHERE data @> '{"category":"..."}' ::jsonb     │
│ └─ Storage measurement with GIN index (separate from B-Tree)                   │
└─────────────────────────────────────────────────────────────────────────────────┘

❌ OVERHEAD: Storage measurement × 2
├─ B-Tree storage: pg_relation_size + pg_indexes_size (with B-Tree index)
└─ GIN storage: pg_relation_size + pg_indexes_size (with GIN index)
```

### Step 8: Build Result (OVERHEAD)

```
benchCore.js → buildResult(rel, mongo, jsonb, stats) L349–380
├─ รวม 7 ops ทั้ง 3 DBs → execution_time_ms object
├─ รวม storage → storage_bytes object
├─ รวม GIN bonus → bonus_jsonb_gin object
└─ เพิ่ม meta (categories/pages/revisions count, timestamp)
```

### Step 9: Cleanup + Response

```
benchCore.js L402–405
├─ pgClient.end()
├─ mongoClient.close()
└─ return result object → server.js → res.json({ success: true, data })
```

### Step 10: FE — แสดงผล

```
BenchmarkPage.jsx L69–85
├─ setResults(data.data)
├─ setHistory(prev → [data.data, ...prev].slice(0, 10))
├─ setLoading(false)
└─ render:
    ├─ Wiki Data info cards (categories/pages/revisions/totalSizeMB)
    ├─ 3-way Execution Time bar chart (7 ops × 3 DBs)
    ├─ Storage comparison bar chart (data/index/total × 3 DBs)
    ├─ GIN vs B-Tree bonus section
    ├─ Detail table (winner per op, times in ms)
    └─ History table (last 10 runs)
```

---

## 4. timer() — วัดอะไร, ไม่วัดอะไร

### ตัว timer เอง

```js
// benchCore.js L14–18
async function timer(fn) {
  const start = performance.now();
  const result = await fn();
  return { time: performance.now() - start, result };
}
```

### ✅ สิ่งที่ timer วัด (Evaluation Time)

| สิ่งที่วัด | อธิบาย |
|-----------|--------|
| Query execution | SQL query / Mongo command จริง |
| Driver overhead | pg driver serialization, Mongo BSON encoding |
| Network hop | server ↔ DB (localhost = negligible) |
| INSERT batching | รวมเวลา loop batched inserts ทั้งหมด |
| FK mapping (PG Rel) | SELECT id→map สำหรับ category_id, page_id (อยู่ใน INSERT timer) |

### ❌ สิ่งที่ timer ไม่วัด (Overhead)

| สิ่งที่ไม่วัด | ทำไม |
|-------------|------|
| loadWikiData() | อ่าน disk + parse JSON — เตรียม data ไม่ใช่ benchmark |
| buildFlatRows() | denormalize data — preprocessing |
| ensurePgDatabase() | สร้าง DB ครั้งเดียว |
| DB connection | connect/close — ไม่ใช่ query |
| DROP TABLE | ล้าง state เก่า |
| CREATE TABLE | สร้าง schema |
| Storage queries | pg_relation_size / collStats — metadata queries |
| buildResult() | format result object |
| HTTP round-trip | FE ↔ server.js |

---

## 5. Data Flow Diagram

```
Wikipedia JSON files (data/json/58 folders)
          │
          ▼
    wikiLoader.js
    loadWikiData()
          │
          ├── categories[58]   ─┐
          ├── pages[~400]      ─┤── 3-level normalized
          └── revisions[~58K]  ─┘
                    │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
   benchPgRelational    buildFlatRows()
   (3 tables + JOIN)        │
          │                 ├── flatRows[~58K] ─┐
          │                 │                    │
          │                 ▼                    ▼
          │          benchMongo()          benchPgJsonb()
          │          (flat docs)          (JSONB column)
          │                 │                    │
          ▼                 ▼                    ▼
     relResult         mongoResult         jsonbResult
          │                 │                    │
          └────────┬────────┘                    │
                   └────────────┬────────────────┘
                                ▼
                         buildResult()
                                │
                                ▼
                    { execution_time_ms,
                      storage_bytes,
                      bonus_jsonb_gin,
                      meta }
```

---

## 6. Storage Measurement

### PG Relational (3 tables combined)

```sql
-- data size (heap)
pg_relation_size('bench_category') + pg_relation_size('bench_page') + pg_relation_size('bench_revision')

-- index size
pg_indexes_size('bench_category') + pg_indexes_size('bench_page') + pg_indexes_size('bench_revision')

-- total
pg_total_relation_size (all 3 tables)
```

### MongoDB

```js
db.command({ collStats: 'bench_mongo' })
// data = stats.size
// index = stats.totalIndexSize
// total = stats.storageSize + stats.totalIndexSize
```

### PG JSONB (วัด 2 ครั้ง)

1. **กับ B-Tree index** (`(data->>'category')`) → `storage` field
2. **กับ GIN index** (`USING GIN(data)`) → `ginStorage` field

---

## 7. API Contract

### GET `/api/benchmark/status`

```json
{
  "success": true,
  "data": {
    "postgres": true,
    "pgVersion": "16.3",
    "mongodb": true,
    "mongoVersion": "7.0.12",
    "wikiData": {
      "categories": 58,
      "pages": 399,
      "revisions": 58123,
      "files": 400,
      "totalSizeMB": 102
    }
  }
}
```

### POST `/api/benchmark/run`

**Request**: ไม่ต้องส่ง body (ใช้ wiki data ทั้งหมด)

**Response**:
```json
{
  "success": true,
  "data": {
    "execution_time_ms": {
      "insert": { "pg_relational": 1245.12, "mongodb": 678.34, "pg_jsonb": 890.56 },
      "selectAll": { "pg_relational": 320.45, "mongodb": 210.23, "pg_jsonb": 280.67 },
      "selectFilter": { "pg_relational": 45.12, "mongodb": 30.89, "pg_jsonb": 40.23 },
      "createIndex": { "pg_relational": 12.34, "mongodb": 8.56, "pg_jsonb": 15.78 },
      "selectIndexed": { "pg_relational": 5.67, "mongodb": 2.34, "pg_jsonb": 6.89 },
      "update": { "pg_relational": 0.45, "mongodb": 0.67, "pg_jsonb": 0.89 },
      "delete": { "pg_relational": 0.34, "mongodb": 0.56, "pg_jsonb": 0.45 }
    },
    "storage_bytes": {
      "pg_relational": { "data": 24576000, "index": 8192000, "total": 32768000 },
      "mongodb": { "data": 28000000, "index": 5000000, "total": 33000000 },
      "pg_jsonb": { "data": 30000000, "index": 6000000, "total": 36000000 }
    },
    "bonus_jsonb_gin": {
      "createIndex_ms": 45.67,
      "selectIndexed_ms": 3.45,
      "storage": { "data": 30000000, "index": 12000000, "total": 42000000 }
    },
    "meta": {
      "categories": 58,
      "pages": 399,
      "revisions": 58123,
      "totalSizeMB": 102,
      "timestamp": "2026-04-23T10:30:00.000Z"
    }
  }
}
```

---

## 8. Benchmark Sequence (Sequential, ไม่ Parallel)

```
time ──────────────────────────────────────────────────────────►

  ┌─────────────────────┐
  │ loadWikiData()      │  ← overhead
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ buildFlatRows()     │  ← overhead
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ connect PG + Mongo  │  ← overhead
  └──────────┬──────────┘
             │
  ┌──────────▼───────────────────────────────────┐
  │ benchPgRelational()                          │
  │ ├─ DROP/CREATE 3 tables      ← overhead      │
  │ ├─ timer(INSERT)             ✅ measured     │
  │ ├─ timer(SELECT ALL)         ✅ measured     │
  │ ├─ timer(SELECT FILTER)      ✅ measured     │
  │ ├─ timer(CREATE INDEX)       ✅ measured     │
  │ ├─ timer(SELECT INDEXED)     ✅ measured     │
  │ ├─ timer(UPDATE)             ✅ measured     │
  │ ├─ timer(DELETE)             ✅ measured     │
  │ └─ pg_relation_size queries  ← overhead      │
  └──────────┬───────────────────────────────────┘
             │
  ┌──────────▼───────────────────────────────────┐
  │ benchMongo()                                 │
  │ ├─ col.drop()                ← overhead      │
  │ ├─ timer(INSERT)             ✅ measured     │
  │ ├─ timer(SELECT ALL)         ✅ measured     │
  │ ├─ timer(SELECT FILTER)      ✅ measured     │
  │ ├─ timer(CREATE INDEX)       ✅ measured     │
  │ ├─ timer(SELECT INDEXED)     ✅ measured     │
  │ ├─ timer(UPDATE)             ✅ measured     │
  │ ├─ timer(DELETE)             ✅ measured     │
  │ └─ collStats                 ← overhead      │
  └──────────┬───────────────────────────────────┘
             │
  ┌──────────▼───────────────────────────────────┐
  │ benchPgJsonb()                               │
  │ ├─ DROP/CREATE table         ← overhead      │
  │ ├─ timer(INSERT)             ✅ measured     │
  │ ├─ timer(SELECT ALL)         ✅ measured     │
  │ ├─ timer(SELECT FILTER)      ✅ measured     │
  │ ├─ timer(CREATE B-Tree)      ✅ measured     │
  │ ├─ timer(SELECT B-Tree)      ✅ measured     │
  │ ├─ storage with B-Tree       ← overhead      │
  │ ├─ DROP B-Tree               ← overhead      │
  │ ├─ timer(CREATE GIN)         ✅ bonus        │
  │ ├─ timer(SELECT GIN)         ✅ bonus        │
  │ ├─ storage with GIN          ← overhead      │
  │ ├─ timer(UPDATE)             ✅ measured     │
  │ └─ timer(DELETE)             ✅ measured     │
  └──────────┬───────────────────────────────────┘
             │
  ┌──────────▼──────────┐
  │ buildResult()       │  ← overhead
  │ close connections   │
  └──────────┬──────────┘
             │
             ▼
      HTTP response → FE render
```

**ทำไม sequential**: ป้องกัน PG กับ Mongo แย่ง CPU/IO กัน → ผลเพี้ยน

---

## 9. Troubleshooting

| อาการ | เช็คอะไร |
|-------|----------|
| FE ขึ้น "ต่อ Benchmark API ไม่ได้" | `npm run server` ใน `benchmark/` ยังรันอยู่ไหม? port 3003 |
| Status → PG offline | PG รัน port 5432? ตรวจ PG_URL ใน `.env` |
| Status → Mongo offline | `mongosh --eval 'db.runCommand({ping:1})'` |
| INSERT ช้ามาก | ดู revisions count (~58K) + content column ใหญ่ |
| Run แรกช้ากว่าปกติ | Cold cache — รัน 2–3 ครั้งแล้วเปรียบเทียบ |

---

## 10. สรุปกลไกสำคัญ

1. **Wikipedia real data** — ไม่ใช่ random data, ใช้ revision history จริงจาก 58 categories
2. **3-table normalized** — bench_category → bench_page → bench_revision (rootid/prev_id linked list)
3. **Fair comparison** — PG Relational ใช้ 3 tables + JOIN, Mongo/JSONB ใช้ flat docs จาก buildFlatRows()
4. **Same filter query** — `category = 'computer_science_research'` ทุก benchmark
5. **timer() วัดเฉพาะ query** — DROP/CREATE/connect/storage ไม่รวม
6. **Sequential execution** — PG Rel → Mongo → PG JSONB ไม่แย่ง resource
7. **Batched INSERT** — หลบ PG param limit 65,535 (maxBatch = 65535 / cols_per_row)
8. **GIN vs B-Tree bonus** — JSONB วัด 2 index types, DROP B-Tree ก่อนสร้าง GIN
9. **Storage รวม 3 tables** — PG Relational รวม size ทั้ง 3 tables เทียบกับ 1 collection/table
10. **No user input** — กดปุ่มเดียว ใช้ wiki data ทั้งหมด ไม่ต้องตั้ง N/K/M
