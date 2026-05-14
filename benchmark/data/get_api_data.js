const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// 1. เปลี่ยนตำแหน่งโฟลเดอร์ปลายทางหลัก
const INPUT_FILE = "./link.json";
const BASE_OUTPUT_DIR = "json"; //can change the path to save

// *** ตั้งค่า User-Agent เพื่อไม่ให้โดนบล็อก 403 (สำคัญมาก ห้ามลบ) ***
const AXIOS_CONFIG = {
  headers: {
    "User-Agent": "MyStudyProjectBot/1.0 (student@example.com)",
    Accept: "application/json",
  },
};

async function main() {
  try {
    // อ่านไฟล์ link.json
    console.log("Reading input file...");
    const rawData = await fs.readFile(INPUT_FILE, "utf-8");
    const categories = JSON.parse(rawData);

    // วนลูปข้อมูลแต่ละหมวดหมู่ (Category)
    for (const category of categories) {
      // 2. สร้าง Path ของโฟลเดอร์ตามชื่อ type (เช่น .../json/plant)
      const typeDir = path.join(BASE_OUTPUT_DIR, category.type);

      // สร้างโฟลเดอร์นั้นๆ ถ้ายังไม่มี
      await fs.ensureDir(typeDir);
      console.log(`\nDirectory ready: ${typeDir}`);

      // วนลูปดึงข้อมูลแต่ละรายการในหมวดหมู่นั้น
      for (const item of category.from) {
        // 3. เปลี่ยนชื่อไฟล์เป็น .json และเก็บในโฟลเดอร์ย่อย (typeDir)
        const fileName = `${item.name}.json`;
        const filePath = path.join(typeDir, fileName);
        const apiUrl = item.api;

        try {
          console.log(`  - Fetching: ${item.name} ...`);
          const response = await axios.get(apiUrl, AXIOS_CONFIG);

          // แปลงข้อมูลเป็น JSON String แบบสวยงาม (Indent 2)
          const fileContent = JSON.stringify(response.data, null, 2);

          // เขียนลงไฟล์
          await fs.writeFile(filePath, fileContent, "utf-8");
          console.log(`    Saved: ${fileName}`);
        } catch (err) {
          if (err.response) {
            console.error(
              `    Error ${item.name}: ${err.response.status} - ${err.response.statusText}`,
            );
          } else {
            console.error(`    Error ${item.name}: ${err.message}`);
          }
        }
      }
    }

    console.log("\nAll done! Job finished.");
  } catch (error) {
    console.error("Critical Error:", error);
  }
}

main();
