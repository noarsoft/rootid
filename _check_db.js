const { Client } = require('pg');
const { MongoClient } = require('mongodb');

async function main() {
  // === PostgreSQL (port 5432) ===
  console.log('=== PostgreSQL (port 5432) ===\n');

  // Try connecting to default postgres db first to check if benchmark db exists
  const pgAdmin = new Client('postgresql://postgres:1234@localhost:5432/postgres');
  try {
    await pgAdmin.connect();
    const dbs = await pgAdmin.query("SELECT datname FROM pg_database WHERE datname NOT IN ('template0','template1') ORDER BY datname");
    console.log('Databases:');
    dbs.rows.forEach(r => console.log('  -', r.datname));
    await pgAdmin.end();
  } catch (e) {
    console.error('❌ PG Admin Error:', e.code, e.message);
    // Try without password
    try {
      const pgAdmin2 = new Client({ host: 'localhost', port: 5432, user: 'postgres', database: 'postgres' });
      await pgAdmin2.connect();
      const dbs = await pgAdmin2.query("SELECT datname FROM pg_database WHERE datname NOT IN ('template0','template1') ORDER BY datname");
      console.log('Databases (no password):');
      dbs.rows.forEach(r => console.log('  -', r.datname));
      await pgAdmin2.end();
    } catch (e2) {
      console.error('❌ PG Admin Error (no pw):', e2.code, e2.message);
    }
  }

  // Try benchmark db on 5432
  console.log('\n--- Trying benchmark db on port 5432 ---\n');
  const pg = new Client('postgresql://postgres:1234@localhost:5432/benchmark');
  try {
    await pg.connect();
    console.log('✅ Connected to benchmark db\n');

    const tables = await pg.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('Tables:');
    if (tables.rows.length === 0) {
      console.log('  (none)');
    }
    tables.rows.forEach(r => console.log('  -', r.table_name));
    console.log();

    for (const r of tables.rows) {
      const cnt = await pg.query(`SELECT COUNT(*) AS c FROM "${r.table_name}"`);
      console.log(`  ${r.table_name}: ${cnt.rows[0].c} rows`);
    }

    const benchTables = ['bench_category', 'bench_page', 'bench_revision', 'bench_jsonb'];
    for (const t of benchTables) {
      const exists = tables.rows.some(r => r.table_name === t);
      if (exists) {
        const cols = await pg.query(
          "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position",
          [t]
        );
        console.log(`\n  [${t}] columns:`);
        cols.rows.forEach(c => console.log(`    ${c.column_name} (${c.data_type})`));
      }
    }

    await pg.end();
  } catch (e) {
    console.error('❌ PG Error:', e.code, e.message);
  }

  // === MongoDB ===
  console.log('\n\n=== MongoDB ===\n');
  const mc = new MongoClient('mongodb://localhost:27017');
  try {
    await mc.connect();
    console.log('✅ Connected\n');

    const db = mc.db('benchmark');
    const cols = await db.listCollections().toArray();
    console.log('Collections:');
    for (const col of cols) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} docs`);

      const sample = await db.collection(col.name).findOne();
      if (sample) {
        console.log(`    Sample keys: ${Object.keys(sample).join(', ')}`);
        // Show a few sample values (truncate long values)
        const keys = Object.keys(sample).filter(k => k !== '_id');
        for (const k of keys.slice(0, 6)) {
          let val = JSON.stringify(sample[k]);
          if (val && val.length > 80) val = val.substring(0, 80) + '...';
          console.log(`    ${k}: ${val}`);
        }
      }
    }
    await mc.close();
  } catch (e) {
    console.error('❌ Mongo Error:', e.message);
  }
}

main();
