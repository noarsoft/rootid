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
  res.send(HTML_PAGE);
});

const HTML_PAGE = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DB Benchmark — PG Relational vs MongoDB vs PG JSONB</title>
<style>
  :root {
    --pg: #336791; --mongo: #4DB33D; --jsonb: #E85D04;
    --win-bg: #d4edda; --win-border: #28a745;
    --bg: #f5f7fa; --card: #fff;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: #333; padding: 2rem; max-width: 1100px; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
  .subtitle { color: #666; font-size: 0.85rem; margin-bottom: 1.5rem; }
  .status-bar { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .status-item { padding: 0.5rem 1rem; border-radius: 6px; background: var(--card); box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-size: 0.85rem; }
  .status-item.ok { border-left: 3px solid #28a745; }
  .status-item.err { border-left: 3px solid #dc3545; }
  .btn { padding: 0.6rem 1.5rem; border: none; border-radius: 6px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-run { background: var(--pg); color: #fff; }
  .btn-run:hover { background: #264f73; }
  .btn-run:disabled { background: #999; cursor: not-allowed; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 6px; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .progress { margin: 1rem 0; padding: 1rem; background: #fff3cd; border-radius: 6px; font-size: 0.9rem; display: none; }
  #results { margin-top: 1.5rem; }
  .legend { display: flex; gap: 1.5rem; margin-bottom: 1rem; font-size: 0.85rem; }
  .legend-item { display: flex; align-items: center; gap: 0.4rem; }
  .legend-dot { width: 12px; height: 12px; border-radius: 2px; }
  h2 { font-size: 1.15rem; margin: 2rem 0 0.5rem; padding-bottom: 0.25rem; border-bottom: 2px solid #dee2e6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; background: var(--card); border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-size: 0.82rem; }
  th, td { padding: 0.45rem 0.65rem; text-align: right; border-bottom: 1px solid #eee; }
  th { background: #f8f9fa; font-weight: 600; text-align: center; }
  td:first-child { text-align: left; }
  .winner { background: var(--win-bg) !important; font-weight: 700; }
  .win-label { text-align: center; font-size: 0.75rem; color: #155724; font-weight: 600; }
  .bar-wrap { display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
  .bar { height: 12px; border-radius: 2px; min-width: 2px; opacity: 0.7; }
  .bar-0 { background: var(--pg); } .bar-1 { background: var(--mongo); } .bar-2 { background: var(--jsonb); }
  .bar-val { font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 55px; text-align: right; }
  .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
  .meta-card { background: var(--card); padding: 0.75rem 1rem; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .meta-card .label { font-size: 0.75rem; color: #888; text-transform: uppercase; }
  .meta-card .value { font-size: 1.3rem; font-weight: 700; }
  footer { margin-top: 2rem; padding-top: 0.75rem; border-top: 1px solid #dee2e6; font-size: 0.75rem; color: #888; }
</style>
</head>
<body>
<h1>DB Benchmark</h1>
<p class="subtitle">PG Relational (3 tables) vs MongoDB (flat) vs PG JSONB (flat) — Wikipedia revision data</p>

<div class="status-bar" id="statusBar">Loading status...</div>

<button class="btn btn-run" id="btnRun" onclick="runBench()" disabled>Run Benchmark</button>
<div class="progress" id="progress"><span class="spinner"></span> Running benchmark... อาจใช้เวลา 10-60 วินาที</div>

<div id="results"></div>

<footer>
  B-Tree index ใช้กับทั้ง 3 databases (fair comparison) · GIN index ทดสอบเพิ่มสำหรับ PG JSONB<br>
  Data: Wikipedia revision history
</footer>

<script>
function fmtMs(ms) {
  if (ms < 1) return (ms*1000).toFixed(0) + 'μs';
  if (ms < 1000) return ms.toFixed(2) + 'ms';
  return (ms/1000).toFixed(2) + 's';
}
function fmtBytes(b) {
  if (!b || b === 0) return '0 B';
  const u = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(Math.abs(b)) / Math.log(1024));
  return (b / Math.pow(1024, i)).toFixed(2) + ' ' + u[i];
}
function winIdx(vals) {
  const min = Math.min(...vals);
  return vals.map(v => v === min);
}
const names = ['PG-Rel','MongoDB','PG-JB'];

async function loadStatus() {
  try {
    const r = await fetch('/api/benchmark/status');
    const d = await r.json();
    if (!d.success) throw new Error(d.error);
    const s = d.data;
    let html = '';
    html += '<div class="status-item '+(s.postgres?'ok':'err')+'">PostgreSQL: '+(s.postgres?'v'+s.pgVersion:'offline')+'</div>';
    html += '<div class="status-item '+(s.mongodb?'ok':'err')+'">MongoDB: '+(s.mongodb?'v'+s.mongoVersion:'offline')+'</div>';
    html += '<div class="status-item ok">Data: '+s.wikiData.categories+' categories, '+s.wikiData.pages+' pages, '+s.wikiData.revisions.toLocaleString()+' revisions</div>';
    document.getElementById('statusBar').innerHTML = html;
    document.getElementById('btnRun').disabled = !(s.postgres && s.mongodb);
  } catch(e) {
    document.getElementById('statusBar').innerHTML = '<div class="status-item err">Error: '+e.message+'</div>';
  }
}

async function runBench() {
  const btn = document.getElementById('btnRun');
  const prog = document.getElementById('progress');
  btn.disabled = true;
  prog.style.display = 'block';
  try {
    const r = await fetch('/api/benchmark/run', { method: 'POST' });
    const d = await r.json();
    if (!d.success) throw new Error(d.error);
    renderResults(d.data);
  } catch(e) {
    document.getElementById('results').innerHTML = '<div class="status-item err">Error: '+e.message+'</div>';
  } finally {
    btn.disabled = false;
    prog.style.display = 'none';
  }
}

function renderResults(data) {
  const t = data.execution_time_ms;
  const sb = data.storage_bytes;
  const gin = data.bonus_jsonb_gin;
  const m = data.meta;
  let html = '';

  html += '<div class="meta-grid">';
  html += '<div class="meta-card"><div class="label">Categories</div><div class="value">'+m.categories+'</div></div>';
  html += '<div class="meta-card"><div class="label">Pages</div><div class="value">'+m.pages+'</div></div>';
  html += '<div class="meta-card"><div class="label">Revisions</div><div class="value">'+m.revisions.toLocaleString()+'</div></div>';
  html += '<div class="meta-card"><div class="label">Data Size</div><div class="value">'+m.totalSizeMB+' MB</div></div>';
  html += '</div>';

  html += '<div class="legend">';
  html += '<div class="legend-item"><div class="legend-dot" style="background:var(--pg)"></div> PG Relational</div>';
  html += '<div class="legend-item"><div class="legend-dot" style="background:var(--mongo)"></div> MongoDB</div>';
  html += '<div class="legend-item"><div class="legend-dot" style="background:var(--jsonb)"></div> PG JSONB</div>';
  html += '<div class="legend-item"><div class="legend-dot" style="background:var(--win-bg);border:1px solid var(--win-border)"></div> Winner</div>';
  html += '</div>';

  const timeOps = [
    ['INSERT (bulk)','insert'], ['SELECT *','selectAll'], ['SELECT no-index','selectFilter'],
    ['CREATE B-Tree','createIndex'], ['SELECT B-Tree','selectIndexed'],
    ['UPDATE (1 row)','update'], ['DELETE (1 row)','delete']
  ];

  html += '<h2>Execution Time</h2>';
  html += '<table><thead><tr><th style="text-align:left">Operation</th><th>PG Relational</th><th>MongoDB</th><th>PG JSONB</th><th>Winner</th></tr></thead><tbody>';
  for (const [label, key] of timeOps) {
    const vals = [t[key].pg_relational, t[key].mongodb, t[key].pg_jsonb];
    const max = Math.max(...vals) || 1;
    const win = winIdx(vals);
    html += '<tr><td style="font-weight:600">'+label+'</td>';
    for (let i=0;i<3;i++) {
      const pct = ((vals[i]/max)*100).toFixed(1);
      html += '<td class="'+(win[i]?'winner':'')+'"><div class="bar-wrap"><div class="bar bar-'+i+'" style="width:'+pct+'%"></div><span class="bar-val">'+fmtMs(vals[i])+'</span></div></td>';
    }
    const w = win.map((v,i)=>v?names[i]:'').filter(Boolean).join('/');
    html += '<td class="win-label">'+w+'</td></tr>';
  }
  html += '</tbody></table>';

  const stOps = [['Data size','data'],['Index size','index'],['Total size','total']];
  html += '<h2>Storage Size</h2>';
  html += '<table><thead><tr><th style="text-align:left">Metric</th><th>PG Relational</th><th>MongoDB</th><th>PG JSONB</th><th>Winner</th></tr></thead><tbody>';
  for (const [label, key] of stOps) {
    const vals = [sb.pg_relational[key], sb.mongodb[key], sb.pg_jsonb[key]];
    const win = winIdx(vals);
    html += '<tr><td style="font-weight:600">'+label+'</td>';
    for (let i=0;i<3;i++) html += '<td class="'+(win[i]?'winner':'')+'">'+fmtBytes(vals[i])+'</td>';
    const w = win.map((v,i)=>v?names[i]:'').filter(Boolean).join('/');
    html += '<td class="win-label">'+w+'</td></tr>';
  }
  html += '</tbody></table>';

  html += '<h2>Bonus: PG JSONB — B-Tree vs GIN Index</h2>';
  html += '<table><thead><tr><th style="text-align:left">Metric</th><th>B-Tree</th><th>GIN</th><th>Note</th></tr></thead><tbody>';
  html += '<tr><td>CREATE INDEX</td><td>'+fmtMs(t.createIndex.pg_jsonb)+'</td><td>'+fmtMs(gin.createIndex_ms)+'</td><td>'+(gin.createIndex_ms > t.createIndex.pg_jsonb ? 'GIN slower':'GIN faster')+'</td></tr>';
  html += '<tr><td>SELECT indexed</td><td>'+fmtMs(t.selectIndexed.pg_jsonb)+'</td><td>'+fmtMs(gin.selectIndexed_ms)+'</td><td>'+(gin.selectIndexed_ms < t.selectIndexed.pg_jsonb ? 'GIN faster':'B-Tree faster')+'</td></tr>';
  html += '<tr><td>Index size</td><td>'+fmtBytes(sb.pg_jsonb.index)+'</td><td>'+fmtBytes(gin.storage.index)+'</td><td>'+(gin.storage.index > sb.pg_jsonb.index ? 'GIN uses more space':'GIN uses less')+'</td></tr>';
  html += '</tbody></table>';

  document.getElementById('results').innerHTML = html;
}

loadStatus();
</script>
</body>
</html>`;

app.listen(PORT, () => {
  console.log('Benchmark server running at http://localhost:' + PORT);
});
