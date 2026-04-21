#!/usr/bin/env node
'use strict';

require('dotenv').config();
const { Client } = require('pg');
const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');
const crypto = require('crypto');

// ==================== PARSE ARGS ====================
const k = parseInt(process.argv[2]);
const n = parseInt(process.argv[3]);

if (!k || !n || k < 1 || n < 1) {
  console.log('Usage: node index.js <k:columns> <n:rows>');
  console.log('  k = number of columns');
  console.log('  n = number of rows');
  console.log('Example: node index.js 10 10000');
  process.exit(1);
}

// ==================== CONFIG ====================
const PG_URL = process.env.PG_URL || 'postgresql://postgres:postgres@localhost:5432/benchmark';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'benchmark';

// ==================== DATA GENERATION ====================
const COL_TYPES = ['string', 'number', 'boolean'];

function generateSchema(k) {
  const schema = {};
  for (let i = 1; i <= k; i++) {
    schema[`col_${i}`] = COL_TYPES[(i - 1) % COL_TYPES.length];
  }
  return schema;
}

function randomStr(len) {
  return crypto.randomBytes(len).toString('hex').slice(0, len);
}

function generateRow(schema) {
  const row = {};
  for (const [key, type] of Object.entries(schema)) {
    if (type === 'string') row[key] = randomStr(10);
    else if (type === 'number') row[key] = Math.floor(Math.random() * 100000);
    else row[key] = Math.random() > 0.5;
  }
  return row;
}

function generateRows(schema, n) {
  const start = performance.now();
  const rows = Array.from({ length: n }, () => generateRow(schema));
  const ms = performance.now() - start;
  console.log(`  Generated ${n.toLocaleString()} rows x ${Object.keys(schema).length} cols in ${ms.toFixed(0)}ms`);
  return rows;
}

// ==================== HELPERS ====================
function fmtBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function fmtMs(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}us`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

async function timer(fn) {
  const start = performance.now();
  const result = await fn();
  return { time: performance.now() - start, result };
}

// ==================== ENSURE PG DATABASE ====================
async function ensurePgDatabase() {
  const url = new URL(PG_URL);
  const dbName = url.pathname.slice(1);
  url.pathname = '/postgres';

  const client = new Client({ connectionString: url.toString() });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`  Created database: ${dbName}`);
    }
  } finally {
    await client.end();
  }
}

// ==================== BENCH: PG RELATIONAL ====================
async function benchPgRelational(pg, schema, rows) {
  const R = {};
  const keys = Object.keys(schema);

  // setup
  await pg.query('DROP TABLE IF EXISTS bench_relational');
  const colDefs = keys.map(key => {
    const t = schema[key];
    if (t === 'string') return `"${key}" VARCHAR(255)`;
    if (t === 'number') return `"${key}" INTEGER`;
    return `"${key}" BOOLEAN`;
  });
  await pg.query(`CREATE TABLE bench_relational (id SERIAL PRIMARY KEY, ${colDefs.join(', ')})`);

  // INSERT (batch)
  const maxBatch = Math.floor(65535 / keys.length);
  const { time: tInsert } = await timer(async () => {
    for (let i = 0; i < rows.length; i += maxBatch) {
      const batch = rows.slice(i, Math.min(i + maxBatch, rows.length));
      const vals = [];
      const phs = batch.map((row, bi) => {
        const ph = keys.map((key, ki) => {
          vals.push(row[key]);
          return `$${bi * keys.length + ki + 1}`;
        });
        return `(${ph.join(',')})`;
      });
      await pg.query(
        `INSERT INTO bench_relational (${keys.map(k => `"${k}"`).join(',')}) VALUES ${phs.join(',')}`,
        vals
      );
    }
  });
  R.insert = tInsert;

  // SELECT ALL
  const { time: tAll } = await timer(() => pg.query('SELECT * FROM bench_relational'));
  R.selectAll = tAll;

  // SELECT FILTER (no index) — filter col_1 (string)
  const fk = keys[0];
  const fv = rows[Math.floor(rows.length / 2)][fk];
  const { time: tFilter } = await timer(() =>
    pg.query(`SELECT * FROM bench_relational WHERE "${fk}" = $1`, [fv])
  );
  R.selectFilter = tFilter;

  // CREATE INDEX on col_1
  const { time: tIdx } = await timer(() =>
    pg.query(`CREATE INDEX idx_bench_rel_1 ON bench_relational("${fk}")`)
  );
  R.createIndex = tIdx;

  // SELECT FILTER (with index)
  const { time: tIdxQ } = await timer(() =>
    pg.query(`SELECT * FROM bench_relational WHERE "${fk}" = $1`, [fv])
  );
  R.selectIndexed = tIdxQ;

  // UPDATE 1 row
  const { time: tUpd } = await timer(() =>
    pg.query(`UPDATE bench_relational SET "${fk}" = $1 WHERE id = 1`, ['updated_val'])
  );
  R.update = tUpd;

  // DELETE 1 row
  const { time: tDel } = await timer(() =>
    pg.query('DELETE FROM bench_relational WHERE id = 1')
  );
  R.delete = tDel;

  // STORAGE
  const sz = await pg.query(`
    SELECT pg_relation_size('bench_relational') AS data,
           pg_indexes_size('bench_relational') AS idx,
           pg_total_relation_size('bench_relational') AS total
  `);
  R.storage = {
    data: parseInt(sz.rows[0].data),
    index: parseInt(sz.rows[0].idx),
    total: parseInt(sz.rows[0].total),
  };

  return R;
}

// ==================== BENCH: PG JSONB-ONLY ====================
// ทดสอบ 2 index: Expression B-Tree (เทียบ fair กับ PG/Mongo) + GIN (bonus)
async function benchPgJsonb(pg, schema, rows) {
  const R = {};

  // setup
  await pg.query('DROP TABLE IF EXISTS bench_jsonb');
  await pg.query(`CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}')`);

  // INSERT (batch) — 1 param per row
  const maxBatch = 65535;
  const { time: tInsert } = await timer(async () => {
    for (let i = 0; i < rows.length; i += maxBatch) {
      const batch = rows.slice(i, Math.min(i + maxBatch, rows.length));
      const vals = [];
      const phs = batch.map((row, bi) => {
        vals.push(JSON.stringify(row));
        return `($${bi + 1}::jsonb)`;
      });
      await pg.query(`INSERT INTO bench_jsonb (data) VALUES ${phs.join(',')}`, vals);
    }
  });
  R.insert = tInsert;

  // SELECT ALL
  const { time: tAll } = await timer(() => pg.query('SELECT * FROM bench_jsonb'));
  R.selectAll = tAll;

  // SELECT FILTER (no index) — use ->>
  const fk = Object.keys(schema)[0];
  const fv = rows[Math.floor(rows.length / 2)][fk];
  const { time: tFilter } = await timer(() =>
    pg.query(`SELECT * FROM bench_jsonb WHERE data->>'${fk}' = $1`, [String(fv)])
  );
  R.selectFilter = tFilter;

  // ---- Phase 1: Expression B-Tree index (fair comparison) ----
  // CREATE Expression B-Tree on data->>'col_1'
  const { time: tBtreeCreate } = await timer(() =>
    pg.query(`CREATE INDEX idx_bench_jsonb_btree ON bench_jsonb ((data->>'${fk}'))`)
  );
  R.createIndex = tBtreeCreate; // main comparison uses B-Tree

  // SELECT with B-Tree — same query as no-index (planner picks B-Tree)
  const { time: tBtreeSelect } = await timer(() =>
    pg.query(`SELECT * FROM bench_jsonb WHERE data->>'${fk}' = $1`, [String(fv)])
  );
  R.selectIndexed = tBtreeSelect; // main comparison uses B-Tree

  // Measure storage with B-Tree only
  const szBtree = await pg.query(`
    SELECT pg_relation_size('bench_jsonb') AS data,
           pg_indexes_size('bench_jsonb') AS idx,
           pg_total_relation_size('bench_jsonb') AS total
  `);
  R.storage = {
    data: parseInt(szBtree.rows[0].data),
    index: parseInt(szBtree.rows[0].idx),
    total: parseInt(szBtree.rows[0].total),
  };

  // Drop B-Tree before GIN test
  await pg.query('DROP INDEX idx_bench_jsonb_btree');

  // ---- Phase 2: GIN index (bonus comparison) ----
  const { time: tGinCreate } = await timer(() =>
    pg.query('CREATE INDEX idx_bench_jsonb_gin ON bench_jsonb USING GIN(data)')
  );
  R.ginCreateIndex = tGinCreate;

  // SELECT with GIN — use @> containment operator
  const { time: tGinSelect } = await timer(() =>
    pg.query('SELECT * FROM bench_jsonb WHERE data @> $1::jsonb', [JSON.stringify({ [fk]: fv })])
  );
  R.ginSelectIndexed = tGinSelect;

  // Measure storage with GIN only
  const szGin = await pg.query(`
    SELECT pg_relation_size('bench_jsonb') AS data,
           pg_indexes_size('bench_jsonb') AS idx,
           pg_total_relation_size('bench_jsonb') AS total
  `);
  R.ginStorage = {
    data: parseInt(szGin.rows[0].data),
    index: parseInt(szGin.rows[0].idx),
    total: parseInt(szGin.rows[0].total),
  };

  // UPDATE 1 row — jsonb merge (with GIN present)
  const { time: tUpd } = await timer(() =>
    pg.query(`UPDATE bench_jsonb SET data = data || $1::jsonb WHERE id = 1`, [
      JSON.stringify({ [fk]: 'updated_val' }),
    ])
  );
  R.update = tUpd;

  // DELETE 1 row
  const { time: tDel } = await timer(() => pg.query('DELETE FROM bench_jsonb WHERE id = 1'));
  R.delete = tDel;

  return R;
}

// ==================== BENCH: MONGODB ====================
async function benchMongo(db, schema, rows) {
  const R = {};
  const col = db.collection('bench_mongo');
  await col.drop().catch(() => {});

  // INSERT
  const { time: tInsert } = await timer(async () => {
    const docs = rows.map((row, i) => ({ _seq: i + 1, ...row }));
    await col.insertMany(docs, { ordered: false });
  });
  R.insert = tInsert;

  // SELECT ALL
  const { time: tAll } = await timer(() => col.find({}).toArray());
  R.selectAll = tAll;

  // SELECT FILTER (no index)
  const fk = Object.keys(schema)[0];
  const fv = rows[Math.floor(rows.length / 2)][fk];
  const { time: tFilter } = await timer(() => col.find({ [fk]: fv }).toArray());
  R.selectFilter = tFilter;

  // CREATE INDEX on col_1
  const { time: tIdx } = await timer(() => col.createIndex({ [fk]: 1 }));
  R.createIndex = tIdx;

  // SELECT FILTER (with index)
  const { time: tIdxQ } = await timer(() => col.find({ [fk]: fv }).toArray());
  R.selectIndexed = tIdxQ;

  // UPDATE 1 row
  const { time: tUpd } = await timer(() =>
    col.updateOne({ _seq: 1 }, { $set: { [fk]: 'updated_val' } })
  );
  R.update = tUpd;

  // DELETE 1 row
  const { time: tDel } = await timer(() => col.deleteOne({ _seq: 1 }));
  R.delete = tDel;

  // STORAGE
  const stats = await db.command({ collStats: 'bench_mongo' });
  R.storage = {
    data: stats.size || 0,
    index: stats.totalIndexSize || 0,
    total: (stats.storageSize || 0) + (stats.totalIndexSize || 0),
  };

  return R;
}

// ==================== REPORT ====================
function win3(a, b, c) {
  const min = Math.min(a, b, c);
  const w = [];
  if (a === min) w.push('PG-Rel');
  if (b === min) w.push('Mongo');
  if (c === min) w.push('PG-JB');
  return w.join('/');
}

function row4(label, a, b, c, fmt, showWinner = true) {
  const line =
    '  ' +
    label.padEnd(20) +
    fmt(a).padEnd(16) +
    fmt(b).padEnd(16) +
    fmt(c).padEnd(16);
  return showWinner ? line + win3(a, b, c) : line;
}

function printReport(rel, mongo, jsonb) {
  const SEP = '-'.repeat(92);
  const HDR = '='.repeat(92);

  console.log('\n' + HDR);
  console.log(`  BENCHMARK RESULTS | k = ${k} columns | n = ${n.toLocaleString()} rows`);
  console.log(`  Index type: ALL B-Tree (fair comparison for paper)`);
  console.log(HDR);

  // ---- Header ----
  const colHeader =
    '  ' +
    'Operation'.padEnd(20) +
    'PG Relational'.padEnd(16) +
    'MongoDB'.padEnd(16) +
    'PG JSONB'.padEnd(16) +
    'Winner';

  // ---- EXECUTION TIME (all B-Tree) ----
  console.log('\n  EXECUTION TIME (all use B-Tree index)');
  console.log(SEP);
  console.log(colHeader);
  console.log(SEP);

  const mainOps = [
    ['INSERT (bulk)', 'insert'],
    ['SELECT *', 'selectAll'],
    ['SELECT no-idx', 'selectFilter'],
    ['CREATE B-Tree', 'createIndex'],
    ['SELECT B-Tree', 'selectIndexed'],
    ['UPDATE (1 row)', 'update'],
    ['DELETE (1 row)', 'delete'],
  ];

  for (const [label, key] of mainOps) {
    console.log(row4(label, rel[key], mongo[key], jsonb[key], fmtMs));
  }

  console.log(SEP);
  console.log(row4('Avg INSERT/row', rel.insert / n, mongo.insert / n, jsonb.insert / n, fmtMs, false));

  // ---- STORAGE (B-Tree) ----
  console.log('\n  STORAGE SIZE (with B-Tree index)');
  console.log(SEP);
  console.log(colHeader.replace('Operation', 'Metric   '));
  console.log(SEP);

  for (const [label, key] of [['Data size', 'data'], ['Index size', 'index'], ['Total size', 'total']]) {
    console.log(row4(label, rel.storage[key], mongo.storage[key], jsonb.storage[key], fmtBytes));
  }
  console.log(SEP);
  console.log(row4(
    'Avg bytes/row',
    rel.storage.data / n,
    mongo.storage.data / n,
    jsonb.storage.data / n,
    fmtBytes
  ));

  // ---- BONUS: GIN vs B-Tree for JSONB ----
  console.log('\n' + HDR);
  console.log('  BONUS: PG JSONB — GIN index vs Expression B-Tree');
  console.log(HDR);
  console.log(
    '  ' +
    'Metric'.padEnd(24) +
    'B-Tree'.padEnd(20) +
    'GIN'.padEnd(20) +
    'Note'
  );
  console.log(SEP);

  console.log(
    '  ' +
    'CREATE INDEX'.padEnd(24) +
    fmtMs(jsonb.createIndex).padEnd(20) +
    fmtMs(jsonb.ginCreateIndex).padEnd(20) +
    (jsonb.ginCreateIndex > jsonb.createIndex ? 'GIN slower to build' : 'GIN faster to build')
  );
  console.log(
    '  ' +
    'SELECT (indexed)'.padEnd(24) +
    fmtMs(jsonb.selectIndexed).padEnd(20) +
    fmtMs(jsonb.ginSelectIndexed).padEnd(20) +
    (jsonb.ginSelectIndexed < jsonb.selectIndexed ? 'GIN faster query' : 'B-Tree faster query')
  );
  console.log(
    '  ' +
    'Index size'.padEnd(24) +
    fmtBytes(jsonb.storage.index).padEnd(20) +
    fmtBytes(jsonb.ginStorage.index).padEnd(20) +
    (jsonb.ginStorage.index > jsonb.storage.index ? 'GIN uses more space' : 'GIN uses less space')
  );
  console.log(
    '  ' +
    'Total size'.padEnd(24) +
    fmtBytes(jsonb.storage.total).padEnd(20) +
    fmtBytes(jsonb.ginStorage.total).padEnd(20)
  );

  console.log('\n  B-Tree: CREATE INDEX ON t ((data->>\'col_1\'))  — index 1 field, same as PG/Mongo');
  console.log('  GIN:    CREATE INDEX ON t USING GIN(data)     — index ALL keys/values');

  console.log('\n' + HDR);

  // ---- Save JSON ----
  const result = {
    config: { k, n, timestamp: new Date().toISOString() },
    index_note: 'Main comparison uses B-Tree for all 3 (fair). GIN is bonus for JSONB.',
    execution_time_ms: {},
    storage_bytes: {},
    bonus_jsonb_gin: {
      createIndex_ms: +jsonb.ginCreateIndex.toFixed(2),
      selectIndexed_ms: +jsonb.ginSelectIndexed.toFixed(2),
      storage: jsonb.ginStorage,
    },
  };
  for (const [, key] of mainOps) {
    result.execution_time_ms[key] = {
      pg_relational: +rel[key].toFixed(2),
      mongodb: +mongo[key].toFixed(2),
      pg_jsonb_btree: +jsonb[key].toFixed(2),
    };
  }
  result.storage_bytes = {
    pg_relational: rel.storage,
    mongodb: mongo.storage,
    pg_jsonb_btree: jsonb.storage,
    pg_jsonb_gin: jsonb.ginStorage,
  };

  const fs = require('fs');
  const filename = `result_k${k}_n${n}.json`;
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
  console.log(`  JSON saved to ${filename}`);

  // ---- Append CSV (1 row per run, all metrics flat) ----
  const CSV_FILE = 'results.csv';
  const csvHeader = [
    'k', 'n', 'timestamp',
    'insert_pg', 'insert_mongo', 'insert_jsonb',
    'selectAll_pg', 'selectAll_mongo', 'selectAll_jsonb',
    'selectFilter_pg', 'selectFilter_mongo', 'selectFilter_jsonb',
    'createIndex_pg', 'createIndex_mongo', 'createIndex_jsonb',
    'selectIndexed_pg', 'selectIndexed_mongo', 'selectIndexed_jsonb',
    'update_pg', 'update_mongo', 'update_jsonb',
    'delete_pg', 'delete_mongo', 'delete_jsonb',
    'storage_data_pg', 'storage_data_mongo', 'storage_data_jsonb',
    'storage_index_pg', 'storage_index_mongo', 'storage_index_jsonb',
    'storage_total_pg', 'storage_total_mongo', 'storage_total_jsonb',
    'avg_bytes_row_pg', 'avg_bytes_row_mongo', 'avg_bytes_row_jsonb',
    'gin_createIndex', 'gin_selectIndexed',
    'gin_storage_index', 'gin_storage_total',
  ];

  const csvRow = [
    k, n, new Date().toISOString(),
    rel.insert.toFixed(2), mongo.insert.toFixed(2), jsonb.insert.toFixed(2),
    rel.selectAll.toFixed(2), mongo.selectAll.toFixed(2), jsonb.selectAll.toFixed(2),
    rel.selectFilter.toFixed(2), mongo.selectFilter.toFixed(2), jsonb.selectFilter.toFixed(2),
    rel.createIndex.toFixed(2), mongo.createIndex.toFixed(2), jsonb.createIndex.toFixed(2),
    rel.selectIndexed.toFixed(2), mongo.selectIndexed.toFixed(2), jsonb.selectIndexed.toFixed(2),
    rel.update.toFixed(2), mongo.update.toFixed(2), jsonb.update.toFixed(2),
    rel.delete.toFixed(2), mongo.delete.toFixed(2), jsonb.delete.toFixed(2),
    rel.storage.data, mongo.storage.data, jsonb.storage.data,
    rel.storage.index, mongo.storage.index, jsonb.storage.index,
    rel.storage.total, mongo.storage.total, jsonb.storage.total,
    (rel.storage.data / n).toFixed(2), (mongo.storage.data / n).toFixed(2), (jsonb.storage.data / n).toFixed(2),
    jsonb.ginCreateIndex.toFixed(2), jsonb.ginSelectIndexed.toFixed(2),
    jsonb.ginStorage.index, jsonb.ginStorage.total,
  ];

  const needHeader = !fs.existsSync(CSV_FILE);
  const csvLine = (needHeader ? csvHeader.join(',') + '\n' : '') + csvRow.join(',') + '\n';
  fs.appendFileSync(CSV_FILE, csvLine);
  console.log(`  CSV  appended to ${CSV_FILE}\n`);
}

// ==================== MAIN ====================
async function main() {
  console.log('==================================================');
  console.log('  DB Benchmark: PG Relational vs MongoDB vs PG JSONB');
  console.log(`  k = ${k} columns | n = ${n.toLocaleString()} rows`);
  console.log('==================================================\n');

  // Generate test data
  const schema = generateSchema(k);
  const typeCount = {};
  for (const t of Object.values(schema)) typeCount[t] = (typeCount[t] || 0) + 1;
  console.log(
    `  Schema: ${Object.entries(typeCount)
      .map(([t, c]) => `${c} ${t}`)
      .join(', ')}`
  );
  const rows = generateRows(schema, n);

  // Ensure PG database exists
  console.log('\n  Setting up PostgreSQL...');
  try {
    await ensurePgDatabase();
  } catch (e) {
    console.error(`  WARN: Could not auto-create DB (${e.message}). Make sure it exists.`);
  }

  // Connect PG
  const pgClient = new Client({ connectionString: PG_URL });
  await pgClient.connect();
  console.log('  PG connected');

  // Connect MongoDB
  const mongoClient = new MongoClient(MONGO_URL);
  await mongoClient.connect();
  const mongoDB = mongoClient.db(MONGO_DB);
  console.log('  MongoDB connected\n');

  // Run benchmarks
  console.log('  [1/3] PG Relational...');
  const relResult = await benchPgRelational(pgClient, schema, rows);
  console.log('         Done');

  console.log('  [2/3] MongoDB...');
  const mongoResult = await benchMongo(mongoDB, schema, rows);
  console.log('         Done');

  console.log('  [3/3] PG JSONB-only...');
  const jsonbResult = await benchPgJsonb(pgClient, schema, rows);
  console.log('         Done');

  // Report
  printReport(relResult, mongoResult, jsonbResult);

  // Cleanup connections
  await pgClient.end();
  await mongoClient.close();
}

main().catch((err) => {
  console.error('\nERROR:', err.message);
  console.error('\nCheck .env config:');
  console.error(`  PG_URL   = ${PG_URL}`);
  console.error(`  MONGO_URL = ${MONGO_URL}`);
  process.exit(1);
});
