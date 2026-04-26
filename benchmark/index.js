#!/usr/bin/env node
'use strict';

require('dotenv').config();
const fs = require('fs');
const { performance } = require('perf_hooks');
const { loadWikiData } = require('./wikiLoader');
const {
  buildFlatRows,
  benchPgRelational,
  benchMongo,
  benchPgJsonb,
  buildResult,
  PG_URL,
  MONGO_URL,
  MONGO_DB,
  DATA_DIR,
} = require('./benchCore');
const { Client } = require('pg');
const { MongoClient } = require('mongodb');

// ==================== FORMAT HELPERS ====================
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

function printReport(rel, mongo, jsonb, stats) {
  const n = stats.revisions;
  const SEP = '-'.repeat(92);
  const HDR = '='.repeat(92);

  console.log('\n' + HDR);
  console.log(`  BENCHMARK RESULTS | Wikipedia data: ${stats.categories} categories, ${stats.pages} pages, ${n.toLocaleString()} revisions`);
  console.log(`  PG Relational: 3 normalized tables | MongoDB & PG JSONB: flat documents`);
  console.log(`  Index type: ALL B-Tree (fair comparison)`);
  console.log(HDR);

  const colHeader =
    '  ' +
    'Operation'.padEnd(20) +
    'PG Relational'.padEnd(16) +
    'MongoDB'.padEnd(16) +
    'PG JSONB'.padEnd(16) +
    'Winner';

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

  console.log('\n' + HDR);
  console.log('  BONUS: PG JSONB — GIN index vs Expression B-Tree');
  console.log(HDR);
  console.log(
    '  ' + 'Metric'.padEnd(24) + 'B-Tree'.padEnd(20) + 'GIN'.padEnd(20) + 'Note'
  );
  console.log(SEP);

  console.log(
    '  ' + 'CREATE INDEX'.padEnd(24) +
    fmtMs(jsonb.createIndex).padEnd(20) +
    fmtMs(jsonb.ginCreateIndex).padEnd(20) +
    (jsonb.ginCreateIndex > jsonb.createIndex ? 'GIN slower to build' : 'GIN faster to build')
  );
  console.log(
    '  ' + 'SELECT (indexed)'.padEnd(24) +
    fmtMs(jsonb.selectIndexed).padEnd(20) +
    fmtMs(jsonb.ginSelectIndexed).padEnd(20) +
    (jsonb.ginSelectIndexed < jsonb.selectIndexed ? 'GIN faster query' : 'B-Tree faster query')
  );
  console.log(
    '  ' + 'Index size'.padEnd(24) +
    fmtBytes(jsonb.storage.index).padEnd(20) +
    fmtBytes(jsonb.ginStorage.index).padEnd(20) +
    (jsonb.ginStorage.index > jsonb.storage.index ? 'GIN uses more space' : 'GIN uses less space')
  );
  console.log(
    '  ' + 'Total size'.padEnd(24) +
    fmtBytes(jsonb.storage.total).padEnd(20) +
    fmtBytes(jsonb.ginStorage.total).padEnd(20)
  );

  console.log('\n  B-Tree: CREATE INDEX ON t ((data->>\'category\'))  — index 1 field');
  console.log('  GIN:    CREATE INDEX ON t USING GIN(data)        — index ALL keys/values');
  console.log('\n' + HDR);

  // Save JSON
  const result = buildResult(rel, mongo, jsonb, stats);
  const filename = `result_wiki_${n}.json`;
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
  console.log(`  JSON saved to ${filename}`);

  // Append CSV
  const CSV_FILE = 'results.csv';
  const csvHeader = [
    'categories', 'pages', 'revisions', 'timestamp',
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
    'gin_createIndex', 'gin_selectIndexed',
    'gin_storage_index', 'gin_storage_total',
  ];

  const csvRow = [
    stats.categories, stats.pages, n, new Date().toISOString(),
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
  console.log('  Data: Wikipedia revisions');
  console.log('==================================================\n');

  console.log('  Loading Wikipedia data...');
  const startLoad = performance.now();
  const { categories, pages, revisions, stats } = loadWikiData(DATA_DIR);
  const loadMs = performance.now() - startLoad;
  console.log(`  Loaded ${stats.categories} categories, ${stats.pages} pages, ${stats.revisions.toLocaleString()} revisions (${stats.totalSizeMB} MB) in ${loadMs.toFixed(0)}ms`);

  const flatRows = buildFlatRows(categories, pages, revisions);
  console.log(`  Built ${flatRows.length.toLocaleString()} flat rows for Mongo/JSONB`);

  console.log('\n  Setting up PostgreSQL...');
  try {
    const { ensurePgDatabase } = require('./benchCore');
    await ensurePgDatabase();
  } catch (e) {
    console.error(`  WARN: Could not auto-create DB (${e.message}). Make sure it exists.`);
  }

  const pgClient = new Client({ connectionString: PG_URL });
  await pgClient.connect();
  console.log('  PG connected');

  const mongoClient = new MongoClient(MONGO_URL);
  await mongoClient.connect();
  const mongoDB = mongoClient.db(MONGO_DB);
  console.log('  MongoDB connected\n');

  console.log('  [1/3] PG Relational (3 tables)...');
  const relResult = await benchPgRelational(pgClient, categories, pages, revisions);
  console.log('         Done');

  console.log('  [2/3] MongoDB (flat docs)...');
  const mongoResult = await benchMongo(mongoDB, flatRows);
  console.log('         Done');

  console.log('  [3/3] PG JSONB (flat docs)...');
  const jsonbResult = await benchPgJsonb(pgClient, flatRows);
  console.log('         Done');

  printReport(relResult, mongoResult, jsonbResult, stats);

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
