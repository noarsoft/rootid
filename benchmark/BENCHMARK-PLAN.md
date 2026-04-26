# Benchmark Refactoring Plan

> แผนแก้ benchmark จาก random data → Wiki data
> วันที่: 2026-04-23

---

## สรุปการเปลี่ยนแปลง

| เดิม                             | ใหม่                                             |
| -------------------------------- | ------------------------------------------------ |
| Random data (crypto.randomBytes) | Wikipedia revision data จริง                     |
| User input: K, N จาก CLI         | ไม่มี input — K=8, N=3,657 จาก data              |
| FE input: N/K/M/runs sliders     | ไม่มี input — กดปุ่ม Run อย่างเดียว              |
| Schema สุ่ม (col_1..col_k)       | Schema ตายตัว (page_title, category, revid, ...) |
| ไม่มี benchmark API server       | Express server port 3003                         |
| Storage แสดงเฉพาะ CLI            | Storage แสดงใน FE ด้วย                           |

---

## Wiki Data

**ที่เก็บ**: `rootid/data/json/` (58 categories, 400 articles, 3,657 revisions, 252 MB)

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

**แปลงเป็น 3 tables (normalized) — ตัวอย่าง data จริง:**

### Table 1: bench_category (58 rows)

| Column    | Type         | ตัวอย่าง row 1         | ตัวอย่าง row 2                 |
| --------- | ------------ | ---------------------- | ------------------------------ |
| id        | SERIAL PK    | 1                      | 2                              |
| rootid    | UUID         | `a1b2c3d4-...`         | `e5f6g7h8-...`                 |
| prev_id   | INTEGER      | NULL                   | NULL                           |
| name      | VARCHAR(100) | `agricultural_science` | `anthropology_and_archaeology` |
| date      | INTEGER      | 20250715               | 20260318                       |
| time      | INTEGER      | 45615                  | 143022                         |
| date_time | BIGINT       | 20250715045615         | 20260318143022                 |

### Table 2: bench_page (400 rows)

> `rootid` = Wikipedia `pageid`

| Column      | Type           | ตัวอย่าง row 1             | ตัวอย่าง row 2             |
| ----------- | -------------- | -------------------------- | -------------------------- |
| id          | SERIAL PK      | 1                          | 2                          |
| rootid      | INTEGER UNIQUE | 22395556 (= pageid)        | 216211 (= pageid)          |
| prev_id     | INTEGER        | NULL                       | NULL                       |
| category_id | INTEGER FK     | 1 (→ agricultural_science) | 1 (→ agricultural_science) |
| page_title  | VARCHAR(500)   | `Agricultural engineering` | `Agroecology`              |
| date        | INTEGER        | 20250715                   | 20260322                   |
| time        | INTEGER        | 45615                      | 91045                      |
| date_time   | BIGINT         | 20250715045615             | 20260322091045             |

### Table 3: bench_revision (3,657 rows)

> `rootid` = Wikipedia `revid`, `prev_id` = Wikipedia `parentid`

| Column    | Type           | ตัวอย่าง row 1                                 | ตัวอย่าง row 2                  |
| --------- | -------------- | ---------------------------------------------- | ------------------------------- |
| id        | SERIAL PK      | 1                                              | 2                               |
| rootid    | INTEGER UNIQUE | 1300578444 (= revid)                           | 1283297281 (= revid)            |
| prev_id   | INTEGER        | 1283297281 (= parentid)                        | 1283296400 (= parentid)         |
| page_id   | INTEGER FK     | 1 (→ Agricultural engineering)                 | 1 (→ Agricultural engineering)  |
| username  | VARCHAR(255)   | `Wikideas1`                                    | `Entranced98`                   |
| timestamp | VARCHAR(30)    | `2025-07-15T04:56:15Z`                         | `2025-03-31T16:50:36Z`          |
| comment   | TEXT           | `/* See also */ List of agricultural journals` | `Reverted edit by 178.176.80.7` |
| content   | TEXT           | `(12,601 chars wiki markup)`                   | `(12,565 chars wiki markup)`    |
| date      | INTEGER        | 20250715                                       | 20250331                        |
| time      | INTEGER        | 45615                                          | 165036                          |
| date_time | BIGINT         | 20250715045615                                 | 20250331165036                  |

### Relation

```
bench_category (58)        bench_page (400)           bench_revision (3,657)
┌──────────────────┐       ┌──────────────────┐       ┌────────────────────────┐
│ id: 1            │──┐    │ id: 1            │──┐    │ id: 1                  │
│ rootid: uuid-1   │  │    │ rootid: 22395556 │  │    │ rootid: 1300578444     │
│ name:            │  │    │  (= pageid)      │  │    │  (= revid)             │
│  agricultural_   │  ├───>│ category_id: 1   │  ├───>│ prev_id: 1283297281    │
│  science         │  │    │ page_title:      │  │    │  (= parentid)          │
│ date: 20250715   │  │    │  Agricultural    │  │    │ page_id: 1             │
└──────────────────┘  │    │  engineering     │  │    │ username: Wikideas1    │
                      │    │ date: 20250715   │  │    │ date: 20250715         │
┌──────────────────┐  │    └──────────────────┘  │    └────────────────────────┘
│ id: 2            │  │    ┌──────────────────┐  │    ┌────────────────────────┐
│ rootid: uuid-3   │  │    │ id: 2            │  │    │ id: 2                  │
│ name:            │  └───>│ rootid: 216211   │  └───>│ rootid: 1283297281     │
│  anthropology_   │       │  (= pageid)      │       │  (= revid)             │
│  and_archaeology │       │ category_id: 1   │       │ prev_id: 1283296400    │
│ date: 20260318   │       │ page_title:      │       │  (= parentid)          │
└──────────────────┘       │  Agroecology     │       │ page_id: 1             │
                           │ date: 20260322   │       │ username: Entranced98  │
                           └──────────────────┘       │ date: 20250331         │
                                                      └────────────────────────┘
```

### date/time/date_time — แปลงจาก Wikipedia timestamp

```
Wikipedia: "2025-07-15T04:56:15Z"
    → date:      20250715      (INTEGER)
    → time:      45615         (INTEGER — ไม่มี leading zero)
    → date_time: 20250715045615 (BIGINT — เกิน INT max 2,147,483,647)
```

---

## Phase 1: Wiki Data Loader

**ไฟล์ใหม่**: `rootid/benchmark/wikiLoader.js`

```
loadWikiData(dataDir)
  → อ่านทุก category folder
  → อ่านทุก .json file
  → แปลง revision → flat record
  → return { records, schema, stats }
```

**Output:**

- `categories[]` — array of 58 unique category names
- `pages[]` — array of 400 objects `{ page_title, category }`
- `revisions[]` — array of 3,657 objects `{ page_title, category, rootid(=revid), prev_id(=parentid), username, timestamp, comment, content }`
- `stats` — `{ categories: 58, files: 400, totalRecords: 3657, totalSizeMB: 252 }`

---

## Phase 2: แก้ benchmark/index.js

### ลบ

- `generateSchema(k)` — สุ่ม col types
- `generateRow(schema)` — สุ่ม row data
- `generateRows(schema, n)` — สุ่ม N rows
- `randomStr(len)` — crypto random
- `COL_TYPES` constant
- CLI params parsing (`process.argv[2], [3]`)

### แทนด้วย

- `wikiLoader.loadWikiData()` — โหลด wiki data
- K=8, N=3,657 จาก data จริง

### คง (ปรับ schema)

- `benchPgRelational()` — table schema เป็น wiki columns
- `benchMongo()` — insert wiki documents
- `benchPgJsonb()` — JSONB + B-Tree + GIN
- `timer()` — วัดเวลา
- Storage measurement — pg_relation_size, collStats
- Console/JSON/CSV output

### CRUD Operations ที่ benchmark

| Operation               | PG Relational (3 tables)                          | MongoDB / PG JSONB             |
| ----------------------- | ------------------------------------------------- | ------------------------------ |
| INSERT                  | INSERT 3 tables ตามลำดับ (category→page→revision) | Bulk insert flat documents     |
| SELECT all              | JOIN 3 tables                                     | Full collection/table scan     |
| SELECT filter (no idx)  | `JOIN + WHERE c.name = ?`                         | `WHERE category = ?`           |
| CREATE INDEX            | B-Tree on `bench_page.category_id`                | B-Tree on `category`           |
| SELECT filter (indexed) | Same JOIN query with index                        | Same query with index          |
| UPDATE                  | Update comment ใน bench_revision                  | Update comment ของ doc/row แรก |
| DELETE                  | Delete 1 row จาก bench_revision                   | Delete doc/row แรก             |

### PG Relational Tables (3 tables, normalized)

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

-- Table 2: bench_page (400 rows)
-- rootid = Wikipedia pageid
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

-- Table 3: bench_revision (3,657 rows)
-- rootid = Wikipedia revid, prev_id = Wikipedia parentid
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

**rootid mapping:**

| Table          | rootid type | ที่มา              | ตัวอย่าง       |
| -------------- | ----------- | ------------------ | -------------- |
| bench_category | UUID        | gen_random_uuid()  | `a1b2c3d4-...` |
| bench_page     | INTEGER     | Wikipedia `pageid` | 22395556       |
| bench_revision | INTEGER     | Wikipedia `revid`  | 1300578444     |

**date/time columns:** แปลงจาก Wikipedia timestamp `2026-04-22T12:55:12Z`

- `date` = `20260422` (INTEGER)
- `time` = `125512` (INTEGER)
- `date_time` = `20260422125512` (BIGINT — เกิน INT max)

---

## Phase 3: Benchmark API Server

**ไฟล์ใหม่**: `rootid/benchmark/server.js` — port 3003

### Endpoints

| Method | Path                    | Response                               |
| ------ | ----------------------- | -------------------------------------- |
| GET    | `/api/benchmark/status` | PG/Mongo connectivity + wiki stats     |
| POST   | `/api/benchmark/run`    | Run benchmark, return timing + storage |

### GET /api/benchmark/status

```json
{
  "success": true,
  "data": {
    "postgres": true,
    "pgVersion": "16.3",
    "mongodb": true,
    "mongoVersion": "8.2",
    "wikiData": {
      "categories": 58,
      "files": 400,
      "totalRecords": 3657,
      "totalSizeMB": 252
    }
  }
}
```

### POST /api/benchmark/run

ไม่มี body — รัน benchmark ทั้งหมดเลย

```json
{
  "success": true,
  "data": {
    "execution_time_ms": {
      "insert": { "pg_relational": 1234, "mongodb": 987, "pg_jsonb": 1456 },
      "selectAll": { "pg_relational": 45, "mongodb": 52, "pg_jsonb": 67 },
      "selectFilter": { "pg_relational": 12, "mongodb": 15, "pg_jsonb": 18 },
      "createIndex": { "pg_relational": 23, "mongodb": 34, "pg_jsonb": 45 },
      "selectIndexed": {
        "pg_relational": 0.5,
        "mongodb": 0.8,
        "pg_jsonb": 1.2
      },
      "update": { "pg_relational": 0.3, "mongodb": 0.4, "pg_jsonb": 0.5 },
      "delete": { "pg_relational": 0.2, "mongodb": 0.3, "pg_jsonb": 0.4 }
    },
    "storage_bytes": {
      "pg_relational": { "data": 0, "index": 0, "total": 0 },
      "mongodb": { "data": 0, "index": 0, "total": 0 },
      "pg_jsonb": { "data": 0, "index": 0, "total": 0 }
    },
    "meta": {
      "k": 8,
      "n": 3657,
      "categories": 58,
      "timestamp": "2026-04-23T..."
    }
  }
}
```

---

## Phase 4: แก้ Frontend (BenchmarkPage.jsx)

### ลบ

- N/K/M/runs sliders + preset buttons
- `calcBigO()` function
- Big O Analysis table
- State: `liveN`, `liveK`, `liveM`, `runs`

### เพิ่ม

- Wiki Data info card (categories, articles, revisions, size)
- Storage comparison section (data/index/total per DB)

### คง (ปรับ)

- Status badge (PG/Mongo versions)
- Run Benchmark button
- CRUD result cards (timing comparison)
- Bar chart (PG vs Mongo vs JSONB)
- Detail table (execution times + winner)
- Run history

### เปลี่ยน

- API endpoint: port 3002 → 3003
- Response mapping ตาม format ใหม่

---

## Phase 5: Clean Up

- ลบ code ที่ไม่ใช้ใน `benchmarkCalc.js` (ถ้ามี random-related)
- อัพเดต `storageCalc.js` ถ้าจำเป็น
- อัพเดต `BENCHMARK-DETAIL.md` ให้ตรงกับ wiki data
- อัพเดต `flow.md` ให้ตรงกับ implementation จริง

---

## ลำดับการทำ

```
Phase 1 → Phase 2 → ทดสอบ CLI ว่ารันได้
  → Phase 3 → Phase 4 → ทดสอบ FE ว่าเรียก API ได้
    → Phase 5 → push
```

---

## ไฟล์ที่เกี่ยวข้อง

### แก้ไข

| ไฟล์                                                | การเปลี่ยน                      |
| --------------------------------------------------- | ------------------------------- |
| `rootid/benchmark/index.js` (603 lines)             | ลบ random logic, ใช้ wikiLoader |
| `rootid/benchmark/report.js` (399 lines)            | ปรับ report ตาม wiki schema     |
| `cakecontrol/src/.../BenchmarkPage.jsx` (592 lines) | ลบ inputs, เพิ่ม storage        |
| `rootid/benchmark/BENCHMARK-DETAIL.md`              | อัพเดตเนื้อหา                   |
| `rootid/benchmark/flow.md`                          | อัพเดตให้ตรง implementation     |

### สร้างใหม่

| ไฟล์                             | หน้าที่                      |
| -------------------------------- | ---------------------------- |
| `rootid/benchmark/wikiLoader.js` | โหลด + แปลง wiki JSON        |
| `rootid/benchmark/server.js`     | Express API server port 3003 |
