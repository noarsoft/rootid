#!/usr/bin/env node
'use strict';

const fs = require('fs');

const CSV_FILE = 'results.csv';
const HTML_FILE = 'report.html';

// ==================== READ CSV ====================
if (!fs.existsSync(CSV_FILE)) {
  console.error(`ERROR: ${CSV_FILE} not found. Run benchmark first: node index.js <k> <n>`);
  process.exit(1);
}

const lines = fs.readFileSync(CSV_FILE, 'utf-8').trim().split('\n');
const headers = lines[0].split(',');
const rows = lines.slice(1).map(line => {
  const vals = line.split(',');
  const obj = {};
  headers.forEach((h, i) => (obj[h] = vals[i]));
  return obj;
});

if (rows.length === 0) {
  console.error('ERROR: No data rows in CSV.');
  process.exit(1);
}

// ==================== GROUP BY k ====================
const byK = {};
for (const row of rows) {
  const kv = row.k;
  if (!byK[kv]) byK[kv] = [];
  byK[kv].push(row);
}
// sort each group by n
for (const kv of Object.keys(byK)) {
  byK[kv].sort((a, b) => Number(a.n) - Number(b.n));
}
const kValues = Object.keys(byK).sort((a, b) => Number(a) - Number(b));

// ==================== HELPERS ====================
function fmtMs(v) {
  const ms = parseFloat(v);
  if (isNaN(ms)) return '-';
  if (ms < 1) return `${(ms * 1000).toFixed(0)}&micro;s`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function fmtBytes(v) {
  const b = parseFloat(v);
  if (isNaN(b) || b === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(b)) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function numF(v) { return parseFloat(v) || 0; }

function winClass(pg, mg, jb) {
  const vals = [numF(pg), numF(mg), numF(jb)];
  const min = Math.min(...vals);
  return vals.map(v => (v === min ? 'winner' : ''));
}

// ==================== BUILD HTML ====================
function buildTimeTable(kv, dataRows, ops, title) {
  let html = `<h3>${title} (k = ${kv})</h3>\n<table>\n<thead><tr>`;
  html += `<th>n</th><th>PG Relational</th><th>MongoDB</th><th>PG JSONB (B-Tree)</th><th>Winner</th>`;
  html += `</tr></thead>\n<tbody>\n`;

  for (const row of dataRows) {
    for (const op of ops) {
      const pg = row[`${op}_pg`];
      const mg = row[`${op}_mongo`];
      const jb = row[`${op}_jsonb`];
      const cls = winClass(pg, mg, jb);
      const names = ['PG-Rel', 'Mongo', 'PG-JB'];
      const winName = cls.map((c, i) => (c === 'winner' ? names[i] : '')).filter(Boolean).join('/');

      // only show n label on first op
      const nLabel = ops.indexOf(op) === 0 ? `<td rowspan="${ops.length}">${Number(row.n).toLocaleString()}</td>` : '';
      html += `<tr>`;
      html += nLabel;
      html += `<td class="${cls[0]}">${fmtMs(pg)}</td>`;
      html += `<td class="${cls[1]}">${fmtMs(mg)}</td>`;
      html += `<td class="${cls[2]}">${fmtMs(jb)}</td>`;
      html += `<td class="win-label">${winName}</td>`;
      html += `</tr>\n`;
    }
  }
  html += `</tbody></table>\n`;
  return html;
}

function generateHtml() {
  // ---- ops definitions ----
  const timeOps = [
    { key: 'insert', label: 'INSERT (bulk)' },
    { key: 'selectAll', label: 'SELECT *' },
    { key: 'selectFilter', label: 'SELECT no-index' },
    { key: 'createIndex', label: 'CREATE B-Tree' },
    { key: 'selectIndexed', label: 'SELECT B-Tree' },
    { key: 'update', label: 'UPDATE (1 row)' },
    { key: 'delete', label: 'DELETE (1 row)' },
  ];

  let body = '';

  // ==================== PER-OPERATION TABLES (grouped by k) ====================
  // bar chart = แต่ละ DB เทียบกับ max ของตัวเอง (ดู scaling ของตัวเอง)
  for (const op of timeOps) {
    body += `<h2>Execution Time &mdash; ${op.label}</h2>\n`;
    for (const kv of kValues) {
      const dataRows = byK[kv];

      // หา max ของแต่ละ DB แยกกัน (ใช้เป็น 100% ของ bar)
      const maxPg = Math.max(...dataRows.map(r => numF(r[`${op.key}_pg`]))) || 1;
      const maxMg = Math.max(...dataRows.map(r => numF(r[`${op.key}_mongo`]))) || 1;
      const maxJb = Math.max(...dataRows.map(r => numF(r[`${op.key}_jsonb`]))) || 1;
      const selfMax = [maxPg, maxMg, maxJb];

      body += `<table>\n<thead><tr>`;
      body += `<th colspan="5" class="group-header">k = ${kv}</th>`;
      body += `</tr><tr><th>n</th><th>PG Relational</th><th>MongoDB</th><th>PG JSONB (B-Tree)</th><th>Winner</th></tr></thead>\n<tbody>\n`;

      for (const row of dataRows) {
        const pg = row[`${op.key}_pg`];
        const mg = row[`${op.key}_mongo`];
        const jb = row[`${op.key}_jsonb`];
        const raw = [pg, mg, jb];
        const cls = winClass(pg, mg, jb);
        const names = ['PG-Rel', 'Mongo', 'PG-JB'];
        const winName = cls.map((c, i) => (c === 'winner' ? names[i] : '')).filter(Boolean).join('/');

        body += `<tr>`;
        body += `<td class="n-col">${Number(row.n).toLocaleString()}</td>`;
        for (let i = 0; i < 3; i++) {
          const pct = ((numF(raw[i]) / selfMax[i]) * 100).toFixed(1);
          body += `<td class="${cls[i]}"><div class="bar-wrap"><div class="bar bar-${i}" style="width:${pct}%"></div><span class="bar-val">${fmtMs(raw[i])}</span></div></td>`;
        }
        body += `<td class="win-label">${winName}</td>`;
        body += `</tr>\n`;
      }
      body += `</tbody></table>\n`;
    }
  }

  // ==================== STORAGE TABLES ====================
  const storageMetrics = [
    { key: 'storage_data', label: 'Data Size' },
    { key: 'storage_index', label: 'Index Size' },
    { key: 'storage_total', label: 'Total Size' },
  ];

  body += `<h2>Storage Size (with B-Tree index)</h2>\n`;
  for (const kv of kValues) {
    const dataRows = byK[kv];
    body += `<table>\n<thead><tr>`;
    body += `<th colspan="5" class="group-header">k = ${kv}</th>`;
    body += `</tr><tr><th>n</th><th>PG Relational</th><th>MongoDB</th><th>PG JSONB (B-Tree)</th><th>Winner</th></tr></thead>\n<tbody>\n`;

    for (const row of dataRows) {
      // separator row with n
      body += `<tr class="n-separator"><td colspan="5">n = ${Number(row.n).toLocaleString()}</td></tr>\n`;
      for (const m of storageMetrics) {
        const pg = row[`${m.key}_pg`];
        const mg = row[`${m.key}_mongo`];
        const jb = row[`${m.key}_jsonb`];
        const cls = winClass(pg, mg, jb);
        const names = ['PG-Rel', 'Mongo', 'PG-JB'];
        const winName = cls.map((c, i) => (c === 'winner' ? names[i] : '')).filter(Boolean).join('/');

        body += `<tr>`;
        body += `<td class="metric-label">${m.label}</td>`;
        body += `<td class="${cls[0]}">${fmtBytes(pg)}</td>`;
        body += `<td class="${cls[1]}">${fmtBytes(mg)}</td>`;
        body += `<td class="${cls[2]}">${fmtBytes(jb)}</td>`;
        body += `<td class="win-label">${winName}</td>`;
        body += `</tr>\n`;
      }
      // avg bytes/row
      const apg = row['avg_bytes_row_pg'];
      const amg = row['avg_bytes_row_mongo'];
      const ajb = row['avg_bytes_row_jsonb'];
      const acls = winClass(apg, amg, ajb);
      const anames = ['PG-Rel', 'Mongo', 'PG-JB'];
      const awin = acls.map((c, i) => (c === 'winner' ? anames[i] : '')).filter(Boolean).join('/');
      body += `<tr class="avg-row">`;
      body += `<td class="metric-label">Avg bytes/row</td>`;
      body += `<td class="${acls[0]}">${fmtBytes(apg)}</td>`;
      body += `<td class="${acls[1]}">${fmtBytes(amg)}</td>`;
      body += `<td class="${acls[2]}">${fmtBytes(ajb)}</td>`;
      body += `<td class="win-label">${awin}</td>`;
      body += `</tr>\n`;
    }
    body += `</tbody></table>\n`;
  }

  // ==================== GIN vs B-Tree BONUS ====================
  body += `<h2>Bonus: PG JSONB &mdash; B-Tree vs GIN Index</h2>\n`;
  body += `<p class="note">B-Tree: <code>CREATE INDEX ON t ((data->>'col_1'))</code> &mdash; 1 field, same as PG/Mongo<br>`;
  body += `GIN: <code>CREATE INDEX ON t USING GIN(data)</code> &mdash; ALL keys/values</p>\n`;

  for (const kv of kValues) {
    const dataRows = byK[kv];
    body += `<table>\n<thead><tr>`;
    body += `<th colspan="6" class="group-header">k = ${kv}</th>`;
    body += `</tr><tr><th>n</th><th>Metric</th><th>B-Tree</th><th>GIN</th><th>Diff</th><th>Note</th></tr></thead>\n<tbody>\n`;

    for (const row of dataRows) {
      const ginCreate = numF(row['gin_createIndex']);
      const btCreate = numF(row['createIndex_jsonb']);
      const ginSelect = numF(row['gin_selectIndexed']);
      const btSelect = numF(row['selectIndexed_jsonb']);
      const ginIdxSize = numF(row['gin_storage_index']);
      const btIdxSize = numF(row['storage_index_jsonb']);

      const metrics = [
        { label: 'CREATE INDEX', bt: btCreate, gin: ginCreate, fmt: fmtMs },
        { label: 'SELECT indexed', bt: btSelect, gin: ginSelect, fmt: fmtMs },
        { label: 'Index size', bt: btIdxSize, gin: ginIdxSize, fmt: fmtBytes },
      ];

      for (let mi = 0; mi < metrics.length; mi++) {
        const m = metrics[mi];
        const diff = m.gin - m.bt;
        const diffPct = m.bt > 0 ? ((diff / m.bt) * 100).toFixed(0) : '-';
        const note = diff > 0 ? 'GIN larger/slower' : diff < 0 ? 'GIN smaller/faster' : 'equal';
        const nCell = mi === 0 ? `<td rowspan="3" class="n-col">${Number(row.n).toLocaleString()}</td>` : '';

        body += `<tr>${nCell}`;
        body += `<td>${m.label}</td>`;
        body += `<td>${m.fmt(m.bt)}</td>`;
        body += `<td>${m.fmt(m.gin)}</td>`;
        body += `<td class="${diff > 0 ? 'worse' : 'better'}">${diffPct}%</td>`;
        body += `<td class="note-cell">${note}</td>`;
        body += `</tr>\n`;
      }
    }
    body += `</tbody></table>\n`;
  }

  // ==================== FULL HTML ====================
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const totalRuns = rows.length;
  const kList = kValues.join(', ');
  const nList = [...new Set(rows.map(r => r.n))].sort((a, b) => a - b).join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DB Benchmark Report</title>
<style>
  :root {
    --pg: #336791;
    --mongo: #4DB33D;
    --jsonb: #E85D04;
    --win-bg: #d4edda;
    --win-border: #28a745;
    --worse: #f8d7da;
    --better: #d4edda;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #f5f7fa;
    color: #333;
    padding: 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }
  h1 {
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
  }
  .subtitle {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
  h2 {
    font-size: 1.25rem;
    margin: 2.5rem 0 0.75rem;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid #dee2e6;
  }
  h3 { font-size: 1rem; margin: 1rem 0 0.5rem; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    font-size: 0.85rem;
  }
  th, td { padding: 0.5rem 0.75rem; text-align: right; border-bottom: 1px solid #eee; }
  th { background: #f8f9fa; font-weight: 600; text-align: center; }
  td:first-child, th:first-child { text-align: left; }
  .group-header {
    background: #e9ecef !important;
    font-size: 0.95rem;
    text-align: left !important;
    letter-spacing: 0.02em;
  }
  .n-col { font-weight: 600; text-align: left; }
  .metric-label { text-align: left; padding-left: 1.5rem; color: #555; }
  .n-separator td {
    background: #f1f3f5;
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid #dee2e6;
  }
  .avg-row { border-top: 2px solid #dee2e6; }
  .avg-row td { font-weight: 600; }
  .winner {
    background: var(--win-bg) !important;
    font-weight: 700;
  }
  .win-label { text-align: center; font-size: 0.78rem; color: #155724; font-weight: 600; }
  .worse { color: #842029; background: var(--worse); text-align: center; }
  .better { color: #155724; background: var(--better); text-align: center; }
  .note-cell { text-align: left; font-size: 0.78rem; color: #666; }
  .note { color: #555; font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.6; }
  code {
    background: #e9ecef;
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    font-size: 0.82rem;
  }
  .bar-wrap { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
  .bar {
    height: 14px;
    border-radius: 2px;
    min-width: 2px;
    opacity: 0.7;
  }
  .bar-0 { background: var(--pg); }
  .bar-1 { background: var(--mongo); }
  .bar-2 { background: var(--jsonb); }
  .bar-val { font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 60px; text-align: right; }
  .legend {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
  }
  .legend-item { display: flex; align-items: center; gap: 0.4rem; }
  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
    font-size: 0.78rem;
    color: #888;
  }
</style>
</head>
<body>
<h1>DB Benchmark Report</h1>
<p class="subtitle">
  PG Relational vs MongoDB vs PG JSONB &mdash;
  ${totalRuns} runs | k = [${kList}] | n = [${nList}]<br>
  Generated: ${timestamp}
</p>

<div class="legend">
  <div class="legend-item"><div class="legend-dot" style="background:var(--pg)"></div> PG Relational</div>
  <div class="legend-item"><div class="legend-dot" style="background:var(--mongo)"></div> MongoDB</div>
  <div class="legend-item"><div class="legend-dot" style="background:var(--jsonb)"></div> PG JSONB</div>
  <div class="legend-item"><div class="legend-dot" style="background:var(--win-bg);border:1px solid var(--win-border)"></div> Winner (lowest)</div>
</div>

${body}

<footer>
  Index note: Main comparison uses B-Tree for all 3 databases (fair comparison).<br>
  GIN index tested separately as bonus for PG JSONB.<br>
  Source: results.csv (${totalRuns} rows)
</footer>
</body>
</html>`;
}

// ==================== WRITE ====================
const html = generateHtml();
fs.writeFileSync(HTML_FILE, html);
console.log(`HTML report generated: ${HTML_FILE}`);
console.log(`  ${rows.length} runs | k = [${kValues.join(', ')}]`);
console.log(`  Open in browser to view.`);
