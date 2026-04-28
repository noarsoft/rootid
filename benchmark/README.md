# Database Benchmark

ระบบวัดประสิทธิภาพ (Benchmark) สำหรับประเมินความเร็วและพื้นที่จัดเก็บ (Storage) โดยทดสอบการนำเข้าและดึงข้อมูล Revision ของ Wikipedia เปรียบเทียบระหว่าง 3 รูปแบบ:
1. **PostgreSQL (Relational)** - แยก 3 ตาราง
2. **MongoDB** - Document Data (Flat)
3. **PostgreSQL (JSONB)** - เก็บเป็น JSONB (Flat)

หน้าจอแสดงผลถูกออกแบบในสไตล์ Premium (อิงดีไซน์จาก CakeControl) โดยสามารถแสดงผลกราฟ Chart.js เพื่อเปรียบเทียบได้ง่าย

---

## วิธีการรัน (How to run)

ระบบนี้ออกแบบมาให้รองรับทั้งการรันผ่าน **Docker** (แนะนำ) และการรันแบบ **Non-Docker (Local)**

### วิธีที่ 1: รันผ่าน Docker (แนะนำ - ง่ายที่สุด)
ระบบจะทำการเปิด Database ทั้ง Postgres, Mongo และเปิด API Server ให้ทั้งหมดแบบคลิกเดียวจบ

1. เปิด Terminal ในโฟลเดอร์ `benchmark/`
2. รันคำสั่ง:
   ```bash
   docker compose up --build -d
   ```
3. เปิดเบราว์เซอร์ไปที่: `http://localhost:3003`

### วิธีที่ 2: รันแบบ Non-Docker (ใช้ Node.js Local)
วิธีนี้เหมาะสำหรับคนที่อยากแก้โค้ด Node.js แล้วเห็นผลทันที โดยที่ยังใช้ Database จาก Docker อยู่

1. ติดตั้งแพ็กเกจ (ทำครั้งแรกครั้งเดียว):
   ```bash
   npm install
   ```
2. สั่งเปิด Database (Postgres/Mongo) ทิ้งไว้:
   ```bash
   docker compose up -d bench-postgres bench-mongo
   ```
3. รันแอปพลิเคชัน:
   ```bash
   npm start
   ```
   *(หรือรันแบบหน้าจอดำผ่าน Terminal ด้วยคำสั่ง `node index.js`)*
4. เปิดเบราว์เซอร์ไปที่: `http://localhost:3003`

---

## ข้อมูล (Dataset)
ชุดข้อมูลที่ใช้ทดสอบถูกเก็บอยู่ในโฟลเดอร์ `data/json/` ประกอบด้วยประวัติการแก้ไข Wikipedia (Revisions) ในหมวดหมู่ Computer Science (เช่น AI, Machine Learning, Deep Learning ฯลฯ)
