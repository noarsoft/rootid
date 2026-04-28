# RootID (Backend)

ระบบ API หลังบ้านของโปรเจค พัฒนาด้วย Node.js, Express และใช้ Prisma เป็น ORM สำหรับเชื่อมต่อกับฐานข้อมูล PostgreSQL

## โครงสร้าง
- `src/` - โค้ดหลักของ API (Controllers, Routes, Services)
- `prisma/` - โครงสร้างฐานข้อมูล (Schema)

## วิธีการรัน (How to run)

1. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

2. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables):
   - คัดลอกไฟล์ `.env.example` เป็น `.env`
   - แก้ไข `DATABASE_URL` ให้ตรงกับฐานข้อมูล PostgreSQL ในเครื่องของคุณ

3. รัน Prisma Migrations (สร้างตารางในฐานข้อมูล):
   ```bash
   npx prisma migrate dev
   ```

4. รัน Server:
   ```bash
   npm run dev
   ```

## เครื่องมือวัดประสิทธิภาพ (Benchmark)
โปรเจคนี้มีระบบ Benchmark ย่อยฝังอยู่ภายในโฟลเดอร์ `benchmark/` กรุณาอ่าน [README ของ Benchmark](./benchmark/README.md) สำหรับวิธีการทดสอบความเร็วระหว่าง Relational vs MongoDB vs JSONB

## เอกสารเพิ่มเติม
สำหรับรายละเอียดเชิงลึกเกี่ยวกับ Architecture และ Design Pattern สามารถอ่านได้ใน [CLAUDE.md](./CLAUDE.md)
