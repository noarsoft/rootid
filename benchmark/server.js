#!/usr/bin/env node
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { runBenchmark, getStatus } = require('./benchCore');

const PORT = process.env.BENCH_PORT || 3003;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files like theme.css

app.get('/api/benchmark/status', async (_req, res) => {
  try {
    const data = await getStatus();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

let running = false;
let lastResult = null;

app.post('/api/benchmark/run', async (_req, res) => {
  if (running) return res.status(409).json({ success: false, error: 'Benchmark is already running' });
  running = true;
  try {
    const data = await runBenchmark();
    lastResult = data;

    const CSV_FILE = 'results.csv';
    const csvHeader = [
      'categories','pages','revisions','timestamp',
      'insert_pg','insert_mongo','insert_jsonb',
      'selectAll_pg','selectAll_mongo','selectAll_jsonb',
      'selectFilter_pg','selectFilter_mongo','selectFilter_jsonb',
      'createIndex_pg','createIndex_mongo','createIndex_jsonb',
      'selectIndexed_pg','selectIndexed_mongo','selectIndexed_jsonb',
      'update_pg','update_mongo','update_jsonb',
      'delete_pg','delete_mongo','delete_jsonb',
      'storage_data_pg','storage_data_mongo','storage_data_jsonb',
      'storage_index_pg','storage_index_mongo','storage_index_jsonb',
      'storage_total_pg','storage_total_mongo','storage_total_jsonb',
      'gin_createIndex','gin_selectIndexed',
      'gin_storage_index','gin_storage_total',
    ];
    const t = data.execution_time_ms;
    const sb = data.storage_bytes;
    const gin = data.bonus_jsonb_gin;
    const csvRow = [
      data.meta.categories, data.meta.pages, data.meta.revisions, new Date().toISOString(),
      t.insert.pg_relational, t.insert.mongodb, t.insert.pg_jsonb,
      t.selectAll.pg_relational, t.selectAll.mongodb, t.selectAll.pg_jsonb,
      t.selectFilter.pg_relational, t.selectFilter.mongodb, t.selectFilter.pg_jsonb,
      t.createIndex.pg_relational, t.createIndex.mongodb, t.createIndex.pg_jsonb,
      t.selectIndexed.pg_relational, t.selectIndexed.mongodb, t.selectIndexed.pg_jsonb,
      t.update.pg_relational, t.update.mongodb, t.update.pg_jsonb,
      t.delete.pg_relational, t.delete.mongodb, t.delete.pg_jsonb,
      sb.pg_relational.data, sb.mongodb.data, sb.pg_jsonb.data,
      sb.pg_relational.index, sb.mongodb.index, sb.pg_jsonb.index,
      sb.pg_relational.total, sb.mongodb.total, sb.pg_jsonb.total,
      gin.createIndex_ms, gin.selectIndexed_ms,
      gin.storage.index, gin.storage.total,
    ];
    const needHeader = !fs.existsSync(CSV_FILE);
    const csvLine = (needHeader ? csvHeader.join(',') + '\n' : '') + csvRow.join(',') + '\n';
    fs.appendFileSync(CSV_FILE, csvLine);

    const filename = `result_wiki_${data.meta.revisions}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    running = false;
  }
});

app.get('/api/benchmark/last', (_req, res) => {
  if (!lastResult) return res.json({ success: false, error: 'No results yet. Run benchmark first.' });
  res.json({ success: true, data: lastResult });
});

app.get('/', (_req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'benchmark.html'));
});

app.listen(PORT, () => {
  console.log('Benchmark server running at http://localhost:' + PORT);
});
