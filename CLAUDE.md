# DB Benchmark — Architecture & Flow Guide

## Overview

Benchmark comparing **PG Relational vs MongoDB vs PG JSONB** using real Wikipedia revision data.

- **Stack**: Express :3003 → PostgreSQL 18 + MongoDB 8
- **Data**: 58 categories, ~400 pages, ~3,657 revisions, ~252 MB
- **No user input**: just click Run

```
Browser (benchmark.html)
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

## How to Run

```bash
npm install                    # first time
docker compose up -d           # PG 18 + Mongo 8
npm start                      # http://localhost:3003 then click Run
```

**Requires**: Docker (PG port 5432, Mongo port 27017)

---

## Code Map

| File | Purpose |
|------|---------|
| `wikiLoader.js` | Load Wikipedia JSON → `{ categories[], pages[], revisions[], stats }` |
| `benchCore.js` | Core: `runBenchmark()`, `getStatus()`, 3 bench functions, `timer()`, `buildFlatRows()` |
| `server.js` | Express API server (2 endpoints, port 3003) |
| `index.js` | CLI runner (`node index.js` from terminal) |
| `fetchWikiData.js` | Fetch Wikipedia data from API |

---

## Wikipedia Data Structure

**No user input** — uses real data from Wikipedia API

| Parameter | Value | Source |
|-----------|-------|--------|
| Categories | 58 | directory names in `data/json/` |
| Pages | ~400 | JSON files (1 file = 1 article) |
| Revisions | ~3,657 | all revisions from every article |
| Data size | ~252 MB | raw JSON from Wikipedia API |

### wikiLoader output

- `categories[]` — 58 objects `{ name, date, time, date_time }`
- `pages[]` — ~400 objects `{ rootid(=pageid), category, page_title, date, time, date_time }`
- `revisions[]` — ~3,657 objects `{ rootid(=revid), prev_id(=parentid), pageid, username, timestamp, comment, content, date, time, date_time }`

### date/time conversion from Wikipedia timestamp

```
Wikipedia: "2025-07-15T04:56:15Z"
    → date:      20250715      (INTEGER)
    → time:      45615         (INTEGER)
    → date_time: 20250715045615 (BIGINT)
```

---

## Database Schemas

Every run **DROPs first → creates fresh**.

### PG Relational (3 normalized tables)

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

### PG JSONB (1 flat table)

```sql
CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}');
```

### MongoDB (1 flat collection)

`insertMany` flat documents — same as JSONB but with `_seq` field for UPDATE/DELETE.

---

## Benchmark Operations (7 ops + GIN bonus)

All 3 approaches run 7 identical operations, each timed with `timer()`:

| # | Operation | PG Relational | PG JSONB | MongoDB |
|---|-----------|--------------|----------|---------|
| 1 | INSERT (bulk) | 3 tables in FK order | 1 param/row | insertMany |
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
| Indexes | single field (category) | all key+value in JSONB |
| Create speed | fast | 3-10x slower |
| Size | small | 4-7x larger |
| Query | `data->>'category' = $1` | `data @> $1::jsonb` |

---

## timer() — What's Measured

```js
async function timer(fn) {
  const start = performance.now();
  const result = await fn();
  return { time: performance.now() - start, result };
}
```

**Measured**: Query execution, driver overhead, network hop (localhost)
**Not measured**: loadWikiData, buildFlatRows, connect, DROP/CREATE TABLE, storage queries, buildResult

---

## Storage Measurement

| Type | Method |
|------|--------|
| PG Relational | `pg_relation_size()` + `pg_indexes_size()` for 3 tables |
| PG JSONB | `pg_relation_size('bench_jsonb')` — measured twice (B-Tree + GIN) |
| MongoDB | `db.command({ collStats })` → size, totalIndexSize, storageSize |

---

## Execution Sequence

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

**Why sequential**: prevents PG and Mongo from competing for CPU/IO.

---

## End-to-End Flow (Click Run)

1. Button disabled + spinner "Running benchmark (10-60 seconds)..."
2. POST /api/benchmark/run (no body)
3. Server checks no benchmark already running (else 409)
4. `runBenchmark()`:
   - loadWikiData → 58 categories, 399 pages, 3,657 revisions
   - buildFlatRows → flatten revision with category/page_title
   - Connect PG (5432) + Mongo (27017)
   - benchPgRelational → DROP 3 tables → CREATE → 7 ops → measure storage
   - benchMongo → DROP collection → 7 ops → measure storage
   - benchPgJsonb → DROP table → CREATE → 7 ops + GIN bonus → measure storage
   - buildResult → combine all 3
5. Save results: `results.csv` (append) + `result_wiki_3657.json` (overwrite)
6. Return JSON → browser renders 2 Chart.js charts:
   - Execution Time (ms) — horizontal bar, log scale
   - Storage Size (MB) — vertical bar

### Timing

| Step | Approximate time |
|------|-----------------|
| loadWikiData (read 252 MB JSON) | 3-8 seconds |
| benchPgRelational (INSERT 3 tables) | 5-20 seconds |
| benchMongo (insertMany) | 3-10 seconds |
| benchPgJsonb (INSERT + GIN) | 5-15 seconds |
| **Total** | **~15-60 seconds** |

INSERT is the slowest operation because the content column is large (~252 MB).
First run is slower due to cold cache — run 2-3 times then compare.

---

## API Contract

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

No body needed → returns `{ success, data: { execution_time_ms, storage_bytes, bonus_jsonb_gin, meta } }`

---

## Output Formats

| Format | File | Description |
|--------|------|-------------|
| Console | - | Execution time table + storage + winner |
| JSON | `result_wiki_3657.json` | Overwritten each run |
| CSV | `results.csv` | Appended each run |
| HTML | `report.html` | `node report.js` reads CSV → generates charts |

---

## Fairness

| Condition | Detail |
|-----------|--------|
| Same data | Same Wikipedia data for all 3 |
| Same filter value | `'computer_science_research'` |
| Same index type | B-Tree for all 3 (main table) |
| Same UPDATE/DELETE row | First row (id=1 / _seq=1) |
| Same timing method | `performance.now()` |
| Sequential | No resource contention |

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| FE shows "Cannot connect to Benchmark API" | Is `npm start` running? Port 3003 |
| Status → PG offline | PG running on port 5432? Check .env |
| Status → Mongo offline | `mongosh --eval 'db.runCommand({ping:1})'` |
| INSERT very slow | content column is large — normal |
| First run slow | Cold cache — run 2-3 times then compare |
