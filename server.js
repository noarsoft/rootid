"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { runBenchmark, getStatus } = require("./benchCore");

const PORT = process.env.BENCH_PORT || 3003;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let running = false;

app.get("/api/benchmark/status", async (_req, res) => {
  try {
    const data = await getStatus();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/benchmark/run-sse", async (req, res) => {
  if (running) return res.status(409).json({ error: "Benchmark already running" });
  running = true;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const emit = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const runs = parseInt(req.query.runs) || 1;
    const result = await runBenchmark(emit, runs);
    saveResults(result);
    emit({ step: "complete", result });
  } catch (err) {
    emit({ step: "error", error: err.message });
  } finally {
    running = false;
    res.end();
  }
});

app.post("/api/benchmark/run", async (_req, res) => {
  if (running) return res.status(409).json({ error: "Benchmark already running" });
  running = true;

  try {
    const result = await runBenchmark();
    saveResults(result);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    running = false;
  }
});

app.get("/api/benchmark/history", (_req, res) => {
  const csvPath = path.join(__dirname, "results.csv");
  if (!fs.existsSync(csvPath)) return res.json({ success: true, data: [] });

  const lines = fs.readFileSync(csvPath, "utf8").trim().split("\n");
  if (lines.length < 2) return res.json({ success: true, data: [] });

  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row = {};
    headers.forEach((h, i) => (row[h] = vals[i]));
    return row;
  });
  res.json({ success: true, data: rows });
});

function saveResults(result) {
  const jsonPath = path.join(__dirname, `result_wiki_${result.meta.revisions}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));

  const csvPath = path.join(__dirname, "results.csv");
  const header = "timestamp,categories,pages,revisions,pg_insert,pg_selectAll,pg_selectFilter,pg_createIndex,pg_selectIndexed,pg_update,pg_delete,mongo_insert,mongo_selectAll,mongo_selectFilter,mongo_createIndex,mongo_selectIndexed,mongo_update,mongo_delete,jsonb_insert,jsonb_selectAll,jsonb_selectFilter,jsonb_createIndex,jsonb_selectIndexed,jsonb_update,jsonb_delete";

  if (!fs.existsSync(csvPath)) fs.writeFileSync(csvPath, header + "\n");

  const e = result.execution_time_ms;
  const m = result.meta;
  const row = [
    m.timestamp, m.categories, m.pages, m.revisions,
    e.insert.pg_relational, e.selectAll.pg_relational, e.selectFilter.pg_relational, e.createIndex.pg_relational, e.selectIndexed.pg_relational, e.update.pg_relational, e.delete.pg_relational,
    e.insert.mongodb, e.selectAll.mongodb, e.selectFilter.mongodb, e.createIndex.mongodb, e.selectIndexed.mongodb, e.update.mongodb, e.delete.mongodb,
    e.insert.pg_jsonb, e.selectAll.pg_jsonb, e.selectFilter.pg_jsonb, e.createIndex.pg_jsonb, e.selectIndexed.pg_jsonb, e.update.pg_jsonb, e.delete.pg_jsonb,
  ].join(",");

  fs.appendFileSync(csvPath, row + "\n");
}

app.listen(PORT, () => {
  console.log(`[benchmark] http://localhost:${PORT}`);
  console.log(`[benchmark] status: GET /api/benchmark/status`);
  console.log(`[benchmark] run:    GET /api/benchmark/run-sse (SSE)`);
});
