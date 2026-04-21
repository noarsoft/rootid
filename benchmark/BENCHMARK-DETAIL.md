# Benchmark — รายละเอียดการทำงานทุกขั้นตอน

> เอกสารนี้อธิบาย `index.js` ทุกส่วนว่าทำงานอย่างไร ตั้งแต่รับ input จนถึง output

---

## 1. Input

```bash
node index.js <k> <n>
```

| Parameter | ความหมาย | ตัวอย่าง |
|-----------|---------|---------|
| `k` | จำนวน column | 10 |
| `n` | จำนวน row | 10000 |

---

## 2. Generate Schema (สร้าง column definitions)

จาก `k` จะสร้าง column สลับ type วนลูป: `string → number → boolean → string → ...`

```
k = 6 จะได้:
col_1: string
col_2: number
col_3: boolean
col_4: string
col_5: number
col_6: boolean
```

**โค้ด:**
```javascript
const COL_TYPES = ['string', 'number', 'boolean'];

function generateSchema(k) {
  const schema = {};
  for (let i = 1; i <= k; i++) {
    schema[`col_${i}`] = COL_TYPES[(i - 1) % COL_TYPES.length];
  }
  return schema;
}
```

---

## 3. Generate Rows (สร้างข้อมูล random)

จาก schema + `n` จะสร้าง n แถว โดย random ค่าตาม type:

| Type | วิธี random | ตัวอย่างค่า |
|------|-----------|-----------|
| string | `crypto.randomBytes(5).toString('hex')` → hex 10 ตัว | `"a3f2b1c9e0"` |
| number | `Math.floor(Math.random() * 100000)` → 0-99999 | `48271` |
| boolean | `Math.random() > 0.5` → true/false | `true` |

**ตัวอย่าง k=4, n=2:**
```json
[
  { "col_1": "a3f2b1c9e0", "col_2": 48271, "col_3": true, "col_4": "d7e8f90a12" },
  { "col_1": "b5c3d2e1f0", "col_2": 12045, "col_3": false, "col_4": "f1a2b3c4d5" }
]
```

> data ชุดเดียวกันนี้ใช้กับทั้ง 3 แบบ (PG Relational, MongoDB, PG JSONB) เพื่อให้ fair

---

## 4. Database Setup (สร้าง table/collection)

ทุกครั้งที่รัน จะ **DROP ก่อน → สร้างใหม่** ไม่มี data เก่าค้าง

### 4.1 PG Relational

```sql
DROP TABLE IF EXISTS bench_relational;

-- สร้างตาราง column แยกตาม schema
CREATE TABLE bench_relational (
    id SERIAL PRIMARY KEY,
    "col_1" VARCHAR(255),    -- string
    "col_2" INTEGER,         -- number
    "col_3" BOOLEAN,         -- boolean
    "col_4" VARCHAR(255),    -- string
    ...
);
```

ข้อมูลเก็บแบบ **relational ปกติ** — แต่ละ column มี type ชัดเจน

### 4.2 PG JSONB-only

```sql
DROP TABLE IF EXISTS bench_jsonb;

CREATE TABLE bench_jsonb (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'
);
```

ข้อมูลทุก column ยัดรวมอยู่ใน **field `data` เป็น JSONB ก้อนเดียว**:
```json
{"col_1": "a3f2b1c9e0", "col_2": 48271, "col_3": true, "col_4": "d7e8f90a12"}
```

### 4.3 MongoDB

```javascript
// drop collection เดิม
await col.drop().catch(() => {});

// ไม่ต้อง create — MongoDB สร้างอัตโนมัติตอน insert
```

ข้อมูลเก็บเป็น **document** (เหมือน JSON):
```json
{"_id": ObjectId("..."), "_seq": 1, "col_1": "a3f2b1c9e0", "col_2": 48271, ...}
```

> `_seq` เป็น field ที่เราเพิ่มเอง (1, 2, 3, ...) เพื่อใช้หา row เฉพาะตอน UPDATE/DELETE ให้ fair กับ PG ที่มี `id SERIAL`

---

## 5. INSERT (bulk) — วัดเวลา insert ทั้ง n rows

### 5.1 PG Relational

```sql
INSERT INTO bench_relational ("col_1", "col_2", "col_3", "col_4")
VALUES ($1,$2,$3,$4), ($5,$6,$7,$8), ($9,$10,$11,$12), ...
```

- ใส่ทีละ batch (ไม่ใช่ทีละแถว) เพื่อความเร็ว
- PostgreSQL มีขีดจำกัด **65,535 parameters** ต่อ query
- batch size = `floor(65535 / k)` เช่น k=10 → batch ละ 6,553 rows
- ถ้า n > batch size จะวนลูปหลาย batch

**ตัวอย่าง k=3, n=5 (ใส่ทีเดียว):**
```sql
INSERT INTO bench_relational ("col_1","col_2","col_3")
VALUES ($1,$2,$3), ($4,$5,$6), ($7,$8,$9), ($10,$11,$12), ($13,$14,$15)
```

### 5.2 PG JSONB

```sql
INSERT INTO bench_jsonb (data)
VALUES ($1::jsonb), ($2::jsonb), ($3::jsonb), ...
```

- แต่ละ row ใช้ **1 parameter** (JSON string ทั้งก้อน)
- batch size = 65,535 rows (parameter 1 ตัวต่อ row)
- เร็วกว่า relational เพราะ parameter น้อยกว่า

**ตัวอย่าง n=3:**
```sql
INSERT INTO bench_jsonb (data)
VALUES ('{"col_1":"abc","col_2":123,"col_3":true}'::jsonb),
       ('{"col_1":"def","col_2":456,"col_3":false}'::jsonb),
       ('{"col_1":"ghi","col_2":789,"col_3":true}'::jsonb)
```

### 5.3 MongoDB

```javascript
const docs = rows.map((row, i) => ({ _seq: i + 1, ...row }));
await col.insertMany(docs, { ordered: false });
```

- `insertMany` — ใส่ทีเดียวทั้ง n documents
- `ordered: false` — ไม่ต้องรอทีละตัว ใส่พร้อมกันได้ (เร็วกว่า)
- เพิ่ม `_seq: 1, 2, 3, ...` เพื่อใช้ UPDATE/DELETE ทีหลัง

---

## 6. SELECT * — วัดเวลาดึงข้อมูลทั้งหมด

ดึง **ทุก row** กลับมาหมด ไม่มี filter

| แบบ | Query |
|-----|-------|
| PG Relational | `SELECT * FROM bench_relational` |
| PG JSONB | `SELECT * FROM bench_jsonb` |
| MongoDB | `col.find({}).toArray()` |

ได้ข้อมูลคืน n rows ทั้งหมด — วัดว่าแต่ละ DB ส่งข้อมูลกลับเร็วแค่ไหน

---

## 7. SELECT filter (no index) — วัด full scan

ค้นหา row ที่ `col_1 = ค่าที่กำหนด` **โดยไม่มี index**

ค่าที่ใช้ filter: เอาจาก row ตรงกลาง `rows[n/2].col_1`

| แบบ | Query | การทำงานภายใน |
|-----|-------|--------------|
| PG Relational | `SELECT * FROM bench_relational WHERE "col_1" = $1` | Sequential scan — อ่านทุก row แล้ว check |
| PG JSONB | `SELECT * FROM bench_jsonb WHERE data->>'col_1' = $1` | Sequential scan — อ่านทุก row, แกะ JSONB, แล้ว check |
| MongoDB | `col.find({ col_1: value }).toArray()` | Collection scan — อ่านทุก document แล้ว check |

> ทั้ง 3 แบบต้อง scan ทุก row → O(n) — วัดว่า full scan ใครเร็วกว่า

---

## 8. CREATE INDEX (B-Tree) — วัดเวลาสร้าง index

สร้าง **B-Tree index** บน `col_1` ทั้ง 3 แบบ (ชนิดเดียวกัน → fair comparison)

| แบบ | Query | ชนิด index |
|-----|-------|-----------|
| PG Relational | `CREATE INDEX idx ON bench_relational("col_1")` | B-Tree |
| PG JSONB | `CREATE INDEX idx ON bench_jsonb ((data->>'col_1'))` | Expression B-Tree |
| MongoDB | `col.createIndex({ col_1: 1 })` | B-Tree (WiredTiger) |

**PG JSONB ใช้ Expression B-Tree:**
- `(data->>'col_1')` = ดึงค่า `col_1` ออกจาก JSONB แล้วสร้าง B-Tree บนค่านั้น
- ทำให้เป็น B-Tree เหมือน PG Relational กับ MongoDB → เทียบได้ fair

---

## 9. SELECT filter (with B-Tree index) — วัด indexed query

Query เดียวกับข้อ 7 แต่ตอนนี้มี B-Tree index แล้ว

| แบบ | Query | การทำงานภายใน |
|-----|-------|--------------|
| PG Relational | `SELECT * FROM bench_relational WHERE "col_1" = $1` | Index scan → O(log n) |
| PG JSONB | `SELECT * FROM bench_jsonb WHERE data->>'col_1' = $1` | Index scan → O(log n) |
| MongoDB | `col.find({ col_1: value }).toArray()` | Index scan → O(log n) |

> ทั้ง 3 ใช้ B-Tree → O(log n) เหมือนกัน — วัดว่า index lookup ใครเร็วกว่า

---

## 10. BONUS: GIN Index (เฉพาะ PG JSONB)

หลังทดสอบ B-Tree เสร็จ จะ **DROP B-Tree** แล้วสร้าง **GIN index** เพิ่มเติม:

```sql
-- ลบ B-Tree
DROP INDEX idx_bench_jsonb_btree;

-- สร้าง GIN
CREATE INDEX idx_bench_jsonb_gin ON bench_jsonb USING GIN(data);

-- Query ใช้ @> containment operator
SELECT * FROM bench_jsonb WHERE data @> '{"col_1":"abc"}'::jsonb;
```

**ความแตกต่าง B-Tree vs GIN:**

| | B-Tree | GIN |
|--|--------|-----|
| Index อะไร | field เดียว (`col_1`) | ทุก key + value ใน JSONB |
| สร้าง | เร็ว | ช้ากว่า 3-10x |
| ขนาด | เล็ก | ใหญ่กว่า 4-7x |
| Query | `data->>'col_1' = $1` | `data @> $1::jsonb` |
| เหมาะกับ | รู้ว่าจะ query field ไหน | ไม่รู้ว่าจะ query field ไหน |

> เป็น bonus comparison — ไม่ใช้ในตารางหลัก เพราะเทียบกับ B-Tree ของ PG Relational / MongoDB ไม่ fair

---

## 11. UPDATE (1 row) — วัดเวลาแก้ 1 แถว

แก้ค่า `col_1` ของ **row แรก** (id=1)

| แบบ | Query |
|-----|-------|
| PG Relational | `UPDATE bench_relational SET "col_1" = 'updated_val' WHERE id = 1` |
| PG JSONB | `UPDATE bench_jsonb SET data = data \|\| '{"col_1":"updated_val"}'::jsonb WHERE id = 1` |
| MongoDB | `col.updateOne({ _seq: 1 }, { $set: { col_1: 'updated_val' } })` |

**วิธี update แตกต่างกัน:**

### PG Relational
```sql
UPDATE bench_relational SET "col_1" = 'updated_val' WHERE id = 1
```
- แก้ column `col_1` ตรงๆ
- PG ภายในสร้าง **tuple version ใหม่** (MVCC) — row เดิมถูก mark as dead

### PG JSONB
```sql
UPDATE bench_jsonb SET data = data || '{"col_1":"updated_val"}'::jsonb WHERE id = 1
```
- `||` = merge JSONB — เอา `{"col_1":"updated_val"}` ไป merge กับ `data` เดิม
- ค่า `col_1` ถูกเขียนทับ field อื่นไม่เปลี่ยน
- ภายในต้อง **deserialize JSONB เดิม → merge → serialize ใหม่**

### MongoDB
```javascript
col.updateOne({ _seq: 1 }, { $set: { col_1: 'updated_val' } })
```
- `$set` = แก้เฉพาะ field `col_1`
- ถ้า document size ไม่เปลี่ยน → **in-place update** (เร็วมาก)
- ถ้า size เปลี่ยน → ต้องย้าย document (ช้ากว่า)

---

## 12. DELETE (1 row) — วัดเวลาลบ 1 แถว

ลบ **row แรก** (id=1)

| แบบ | Query |
|-----|-------|
| PG Relational | `DELETE FROM bench_relational WHERE id = 1` |
| PG JSONB | `DELETE FROM bench_jsonb WHERE id = 1` |
| MongoDB | `col.deleteOne({ _seq: 1 })` |

**วิธี delete แตกต่างกัน:**

### PG Relational & PG JSONB
```sql
DELETE FROM bench_relational WHERE id = 1
```
- PG ไม่ได้ลบจริง — แค่ **mark tuple as dead** (MVCC)
- ต้องรอ `VACUUM` มาทำความสะอาดทีหลัง
- เร็ว เพราะแค่ mark ไม่ต้อง rewrite

### MongoDB
```javascript
col.deleteOne({ _seq: 1 })
```
- ลบ document ตรงๆ ออกจาก collection
- พื้นที่ว่างอาจถูก reuse โดย document ใหม่

---

## 13. Storage Measurement — วัดขนาดข้อมูล

### PG (ทั้ง Relational และ JSONB)

```sql
SELECT
    pg_relation_size('bench_relational') AS data,     -- ขนาด data อย่างเดียว
    pg_indexes_size('bench_relational') AS idx,        -- ขนาด index ทั้งหมด
    pg_total_relation_size('bench_relational') AS total -- data + index + toast
FROM ...;
```

| ค่า | ความหมาย |
|-----|---------|
| `data` | ขนาดข้อมูลจริง (ไม่รวม index) |
| `index` | ขนาด index ทั้งหมด (PK + B-Tree ที่สร้าง) |
| `total` | data + index + TOAST (JSONB ที่ใหญ่มากจะถูกย้ายไป TOAST) |

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
  INSERT (bulk)       31.38ms         38.16ms         17.93ms         PG-JB
  SELECT *            9.71ms          19.07ms         3.52ms          PG-JB
  ...
```

### 15.2 JSON (1 ไฟล์ต่อรอบ)

ชื่อไฟล์: `result_k{k}_n{n}.json` เช่น `result_k10_n1000.json`
- ถ้ารันซ้ำ k,n เดิม → **เขียนทับ**

### 15.3 CSV (สะสมทุกรอบ)

ชื่อไฟล์: `results.csv`
- รอบแรก: สร้างไฟล์ + เขียน header
- รอบถัดไป: **append แถวใหม่** ต่อท้าย (ไม่เขียนทับ)
- 1 แถว = 1 รอบ (k, n, timestamp, ทุก metric)

```csv
k,n,timestamp,insert_pg,insert_mongo,insert_jsonb,...
5,100,2026-04-10T...,4.76,23.10,4.24,...
10,1000,2026-04-10T...,31.38,38.16,17.93,...
```

### 15.4 HTML Report (สร้างจาก CSV)

```bash
node report.js    # อ่าน results.csv → สร้าง report.html
```

- จัดกลุ่มตาม k
- เรียงตาม n
- มี bar chart (แต่ละ DB เทียบกับ max ของตัวเอง)
- มีสี highlight winner
- มี bonus GIN vs B-Tree section

---

## 16. Flow Diagram

```
node index.js 10 1000
       │
       ▼
┌─────────────────────┐
│ 1. Generate Schema  │  k=10 → col_1:string, col_2:number, ..., col_10:boolean
│ 2. Generate Rows    │  n=1000 → random data 1000 แถว
└──────────┬──────────┘
           │ data ชุดเดียวกัน ใช้ทั้ง 3 แบบ
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    [1/3] PG Relational                           │
│                                                                  │
│  DROP TABLE → CREATE TABLE (10 columns) → INSERT 1000 rows      │
│  → SELECT * → SELECT WHERE (no idx) → CREATE B-Tree INDEX       │
│  → SELECT WHERE (with idx) → UPDATE 1 row → DELETE 1 row        │
│  → pg_relation_size() / pg_indexes_size()                        │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    [2/3] MongoDB                                  │
│                                                                  │
│  drop() → insertMany(1000 docs) → find({}) → find({col_1:val}) │
│  → createIndex({col_1:1}) → find({col_1:val})                   │
│  → updateOne({_seq:1}) → deleteOne({_seq:1})                     │
│  → collStats                                                     │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    [3/3] PG JSONB                                 │
│                                                                  │
│  DROP TABLE → CREATE TABLE (id + data JSONB) → INSERT 1000 rows │
│  → SELECT * → SELECT WHERE data->>'col_1' (no idx)              │
│                                                                  │
│  Phase 1 — B-Tree (ใช้ในตารางหลัก):                               │
│  → CREATE Expression B-Tree INDEX → SELECT → วัด storage → DROP  │
│                                                                  │
│  Phase 2 — GIN (bonus):                                          │
│  → CREATE GIN INDEX → SELECT @> → วัด storage                    │
│                                                                  │
│  → UPDATE data || jsonb → DELETE → วัด storage                    │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Print console table │
│ Save JSON           │  result_k10_n1000.json (เขียนทับ)
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
| Data เดียวกัน | generate ครั้งเดียว ใช้กับทั้ง 3 |
| Filter value เดียวกัน | ใช้ `rows[n/2].col_1` ทั้ง 3 |
| Index ชนิดเดียวกัน | B-Tree ทั้ง 3 (ตารางหลัก) |
| UPDATE/DELETE row เดียวกัน | row แรก (id=1 / _seq=1) |
| วัดเวลาแบบเดียวกัน | `performance.now()` ทั้ง 3 |
| เครื่องเดียวกัน | localhost ทั้ง PG และ MongoDB |

---

## 18. สิ่งที่ต่างกัน (ตามธรรมชาติของแต่ละ DB)

| PG Relational | PG JSONB | MongoDB |
|--------------|----------|---------|
| column แยก (strong type) | JSONB ก้อนเดียว | BSON document |
| INSERT ใช้ k params/row | INSERT ใช้ 1 param/row | insertMany |
| UPDATE SET col = val | UPDATE data \|\| jsonb (merge) | $set field |
| DELETE mark dead (MVCC) | DELETE mark dead (MVCC) | ลบจริง |
| B-Tree บน column ตรงๆ | Expression B-Tree บน data->>'col' | B-Tree (WiredTiger) |
| pg_relation_size() | pg_relation_size() | collStats |
