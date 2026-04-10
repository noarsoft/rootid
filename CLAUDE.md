# RootID — Claude Context

## Project Overview
Express.js Backend API สำหรับ CakeControl Form Builder system
ใช้ PostgreSQL (Prisma)
ไม่มี auth ใช้ฟรี

## Tech Stack
- Express 5, Node.js
- Prisma (PostgreSQL) — 4 tables (schema, view, formcfg, form)
- Port: 3002

## Project Structure
```
src/
├── config/          # db.prisma.js
├── controllers/     # schemax, viewx, formcfgx, formx
├── services/        # business logic per table
├── routes/          # Express routes (index.js รวม)
├── middlewares/     # error handler
├── utils/           # datetime helper
├── app.js           # Express app setup
└── server.js        # Entry point
prisma/
└── schema.prisma    # 4 tables: data_schema, data_view, data_formcfg, data_form
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| CRUD | /api/schemax | data_schema |
| CRUD | /api/viewx | data_view |
| CRUD | /api/formcfgx | data_formcfg |
| CRUD | /api/formx | data_form |

Each CRUD: GET /, GET /:root_id, POST /, PUT /:root_id, DELETE /:root_id

## Naming Conventions
- API routes: suffix `x` (schemax, viewx, formcfgx, formx)
- Files: `xxx.controller.js`, `xxx.service.js`, `xxx.routes.js`
- DB: soft delete via `activate` field
- Date format: `yyyymmdd_hhmmss` (VARCHAR)

## DB Design
ดู DB-DESIGN.md ที่ cakecontrol/ — 4 tables ตาม Prisma schema
- root_id = UUID PK
- id = SERIAL ใช้เป็น FK
- previous_id = versioning via linked list

## Benchmark (แผนย้ายเข้า repo นี้)
ตอนนี้อยู่ที่ `workspace-cakecontrol/benchmark/` — แผนย้ายมาอยู่ `rootid/benchmark/`

**เป้าหมาย**: วัด execution time + storage ของระบบจริง rootid
- เปรียบเทียบ 3 แบบ: PG Relational vs MongoDB vs PG JSONB-only
- Input: k (columns), n (rows)
- วัด: INSERT, SELECT (no-index, B-Tree, GIN), UPDATE, DELETE, Storage
- Output: console, JSON, CSV (append), HTML report
- Index: ทั้ง 3 ใช้ B-Tree (fair comparison สำหรับ paper) + bonus GIN
- DB: PostgreSQL 18 (port 5433, pass 1234) + MongoDB 8.2 (port 27017, no auth)

**ไฟล์ benchmark**:
- `index.js` — benchmark script หลัก
- `report.js` — สร้าง HTML report จาก results.csv
- `results.csv` — สะสมผลทุกรอบ (append)
- `report.html` — สร้างใหม่จาก CSV ทุกครั้ง

**ค่าที่ทดสอบแล้ว**: k=[5,10,20,50] x n=[10,100,1K,5K,10K,50K,100K,1M] = 32 รอบ

## Communication Rules
- ตอบตรงๆ ไม่อวย
- สงสัยก็ถาม
- แนะนำ 3 ข้อ
- ไม่มีก็บอกไม่มี
