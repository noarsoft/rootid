"use strict";

const path = require("path");
const { Client } = require("pg");
const { MongoClient } = require("mongodb");
const { performance } = require("perf_hooks");
const { loadWikiData } = require("./wikiLoader");

const PG_URL =
  process.env.PG_URL || "postgresql://postgres:1234@localhost:5432/benchmark";
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "benchmark";
const DATA_DIR = path.join(__dirname, "data", "json");
const PG_MAX_PARAMS = 65535;
const FILTER_CATEGORY = "computer_science_research";

let _wikiCache = null;
function getWikiData() {
  if (!_wikiCache) _wikiCache = loadWikiData(DATA_DIR);
  return _wikiCache;
}

async function timer(fn) {
  const start = performance.now();
  const result = await fn();
  return { time: performance.now() - start, result };
}

function buildFlatRows(pages, revisions) {
  const pageMap = new Map();
  pages.forEach((p) => pageMap.set(p.rootid, p));

  return revisions.map((rev) => {
    const pg = pageMap.get(rev.pageid) || {};
    return {
      rootid: rev.rootid,
      prev_id: rev.prev_id,
      page_rootid: rev.pageid,
      page_title: pg.page_title || "",
      category: pg.category || "",
      username: rev.username,
      timestamp: rev.timestamp,
      comment: rev.comment,
      content: rev.content,
      date: rev.date,
      time: rev.time,
      date_time: rev.date_time,
    };
  });
}

async function ensurePgDatabase() {
  const url = new URL(PG_URL);
  const dbName = url.pathname.slice(1);
  url.pathname = "/postgres";

  const client = new Client({ connectionString: url.toString() });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName],
    );
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
    }
  } finally {
    await client.end();
  }
}

function validateRowCounts(rel, mongo, jsonb) {
  const checks = [];
  const ops = ["selectAll", "selectFilter", "selectIndexed"];
  for (const op of ops) {
    const pg = rel.rowCounts[op];
    const mo = mongo.rowCounts[op];
    const jb = jsonb.rowCounts[op];
    const match = pg === mo && mo === jb;
    checks.push({
      operation: op,
      pg_relational: pg,
      mongodb: mo,
      pg_jsonb: jb,
      match,
    });
  }
  return {
    all_match: checks.every((c) => c.match),
    details: checks,
  };
}

function buildResult(rel, mongo, jsonb, stats, flatRows) {
  const mainOps = [
    "insert",
    "selectAll",
    "selectFilter",
    "createIndex",
    "selectIndexed",
    "update",
    "delete",
  ];
  const execution_time_ms = {};
  for (const key of mainOps) {
    execution_time_ms[key] = {
      pg_relational: +rel[key].toFixed(2),
      mongodb: +mongo[key].toFixed(2),
      pg_jsonb: +jsonb[key].toFixed(2),
    };
  }

  return {
    execution_time_ms,
    storage_bytes: {
      pg_relational: rel.storage,
      mongodb: mongo.storage,
      pg_jsonb: jsonb.storage,
    },
    bonus_jsonb_gin: {
      createIndex_ms: +jsonb.ginCreateIndex.toFixed(2),
      selectIndexed_ms: +jsonb.ginSelectIndexed.toFixed(2),
      storage: jsonb.ginStorage,
    },
    row_counts: {
      insert: {
        pg_relational: rel.rowCounts.insert,
        mongodb: mongo.rowCounts.insert,
        pg_jsonb: jsonb.rowCounts.insert,
      },
      selectAll: {
        pg_relational: rel.rowCounts.selectAll,
        mongodb: mongo.rowCounts.selectAll,
        pg_jsonb: jsonb.rowCounts.selectAll,
      },
      selectFilter: {
        pg_relational: rel.rowCounts.selectFilter,
        mongodb: mongo.rowCounts.selectFilter,
        pg_jsonb: jsonb.rowCounts.selectFilter,
      },
      selectIndexed: {
        pg_relational: rel.rowCounts.selectIndexed,
        mongodb: mongo.rowCounts.selectIndexed,
        pg_jsonb: jsonb.rowCounts.selectIndexed,
      },
      update: { pg_relational: 1, mongodb: 1, pg_jsonb: 1 },
      delete: { pg_relational: 1, mongodb: 1, pg_jsonb: 1 },
    },
    row_count_validation: validateRowCounts(rel, mongo, jsonb),
    explain_plans: {
      pg_relational: rel.explainPlans || {},
      pg_jsonb: jsonb.explainPlans || {},
    },
    meta: {
      categories: stats.categories,
      pages: stats.pages,
      revisions: stats.revisions,
      totalSizeMB: stats.totalSizeMB,
      timestamp: new Date().toISOString(),
    },
    sampleData: flatRows.slice(0, 5).map((f) => ({
      rootid: f.rootid,
      prev_id: f.prev_id,
      page_rootid: f.page_rootid,
      page_title: f.page_title,
      category: f.category,
      username: f.username,
      timestamp: f.timestamp,
      comment: (f.comment || "").slice(0, 80),
      content_length: (f.content || "").length,
    })),
  };
}

function averageResults(results) {
  const n = results.length;
  if (n === 1) return results[0];

  const base = JSON.parse(JSON.stringify(results[0]));
  const engines = ["pg_relational", "mongodb", "pg_jsonb"];
  const ops = Object.keys(base.execution_time_ms);

  for (const op of ops) {
    for (const eng of engines) {
      const values = results.map((r) => r.execution_time_ms[op][eng]);
      base.execution_time_ms[op][eng] = +(
        values.reduce((a, b) => a + b, 0) / n
      ).toFixed(2);
    }
  }

  base.meta.runs = n;
  base.meta.per_run = results.map((r) => ({
    timestamp: r.meta.timestamp,
    execution_time_ms: r.execution_time_ms,
  }));

  return base;
}

async function runSingleBenchmark(pgClient, mongoDB, categories, pages, revisions, flatRows, stats, emit) {
  emit({
    step: "pg_rel",
    message: "[1/3] PG Relational — DROP + CREATE tables...",
  });
  const relResult = await benchPgRelational(
    pgClient,
    categories,
    pages,
    revisions,
    emit,
  );

  emit({ step: "mongo", message: "[2/3] MongoDB — DROP collection..." });
  const mongoResult = await benchMongo(mongoDB, flatRows, emit);

  emit({
    step: "pg_jsonb",
    message: "[3/3] PG JSONB — DROP + CREATE table...",
  });
  const jsonbResult = await benchPgJsonb(pgClient, flatRows, emit);

  return buildResult(relResult, mongoResult, jsonbResult, stats, flatRows);
}

async function runBenchmark(onProgress, runCount = 1) {
  const emit = onProgress || (() => {});
  const runs = Math.max(1, Math.min(runCount, 10));

  emit({ step: "load", message: "Loading Wikipedia data..." });
  const wikiData = getWikiData();
  const { categories, pages, revisions, stats } = wikiData;

  emit({
    step: "flatten",
    message: `Building flat rows (${revisions.length} revisions)...`,
  });
  const flatRows = buildFlatRows(pages, revisions);

  emit({ step: "connect", message: "Connecting to PostgreSQL + MongoDB..." });
  await ensurePgDatabase();

  const pgClient = new Client({ connectionString: PG_URL });
  await pgClient.connect();

  const mongoClient = new MongoClient(MONGO_URL);
  await mongoClient.connect();
  const mongoDB = mongoClient.db(MONGO_DB);

  try {
    const results = [];
    for (let i = 0; i < runs; i++) {
      if (runs > 1) {
        emit({ step: "run_start", message: `Run ${i + 1}/${runs}...`, run: i + 1, total: runs });
      }
      const result = await runSingleBenchmark(
        pgClient, mongoDB, categories, pages, revisions, flatRows, stats, emit,
      );
      results.push(result);
    }

    emit({ step: "done", message: "Building results..." });
    return averageResults(results);
  } finally {
    await pgClient.end();
    await mongoClient.close();
  }
}

async function benchPgRelational(pg, categories, pages, rawRevisions, emit) {
  const seen = new Set();
  const revisions = rawRevisions.filter((r) => {
    if (seen.has(r.rootid)) return false;
    seen.add(r.rootid);
    return true;
  });
  const R = {};

  await pg.query("DROP TABLE IF EXISTS bench_revision");
  await pg.query("DROP TABLE IF EXISTS bench_page");
  await pg.query("DROP TABLE IF EXISTS bench_category");
  await pg.query(
    `CREATE TABLE bench_category (id SERIAL PRIMARY KEY, rootid UUID UNIQUE DEFAULT gen_random_uuid(), prev_id INTEGER, name VARCHAR(100), date INTEGER, time INTEGER, date_time BIGINT)`,
  );
  await pg.query(
    `CREATE TABLE bench_page (id SERIAL PRIMARY KEY, rootid INTEGER UNIQUE NOT NULL, prev_id INTEGER, category_id INTEGER REFERENCES bench_category(id), page_title VARCHAR(500), date INTEGER, time INTEGER, date_time BIGINT)`,
  );
  await pg.query(
    `CREATE TABLE bench_revision (id SERIAL PRIMARY KEY, rootid INTEGER UNIQUE NOT NULL, prev_id INTEGER, page_id INTEGER REFERENCES bench_page(id), username VARCHAR(255), timestamp VARCHAR(30), comment TEXT, content TEXT, date INTEGER, time INTEGER, date_time BIGINT)`,
  );

  emit({
    step: "pg_rel_insert",
    message: "[1/3] PG Relational — INSERT 3 tables...",
  });
  const { time: tInsert } = await timer(async () => {
    const catVals = [];
    const catPhs = categories.map((c, i) => {
      const off = i * 4;
      catVals.push(c.name, c.date, c.time, c.date_time);
      return `($${off + 1},$${off + 2},$${off + 3},$${off + 4})`;
    });
    await pg.query(
      `INSERT INTO bench_category (name, date, time, date_time) VALUES ${catPhs.join(",")}`,
      catVals,
    );
    const catRows = await pg.query("SELECT id, name FROM bench_category");
    const catIdMap = new Map();
    catRows.rows.forEach((r) => catIdMap.set(r.name, r.id));
    const maxPageBatch = Math.floor(PG_MAX_PARAMS / 6);
    for (let i = 0; i < pages.length; i += maxPageBatch) {
      const batch = pages.slice(i, Math.min(i + maxPageBatch, pages.length));
      const vals = [];
      const phs = batch.map((p, bi) => {
        const off = bi * 6;
        vals.push(
          p.rootid,
          catIdMap.get(p.category),
          p.page_title,
          p.date,
          p.time,
          p.date_time,
        );
        return `($${off + 1},$${off + 2},$${off + 3},$${off + 4},$${off + 5},$${off + 6})`;
      });
      await pg.query(
        `INSERT INTO bench_page (rootid, category_id, page_title, date, time, date_time) VALUES ${phs.join(",")}`,
        vals,
      );
    }
    const pageRows = await pg.query("SELECT id, rootid FROM bench_page");
    const pageIdMap = new Map();
    pageRows.rows.forEach((r) => pageIdMap.set(r.rootid, r.id));
    const maxRevBatch = Math.floor(PG_MAX_PARAMS / 10);
    for (let i = 0; i < revisions.length; i += maxRevBatch) {
      const batch = revisions.slice(
        i,
        Math.min(i + maxRevBatch, revisions.length),
      );
      const vals = [];
      const phs = batch.map((rev, bi) => {
        const off = bi * 10;
        vals.push(
          rev.rootid,
          rev.prev_id,
          pageIdMap.get(rev.pageid),
          rev.username,
          rev.timestamp,
          rev.comment,
          rev.content,
          rev.date,
          rev.time,
          rev.date_time,
        );
        return `($${off + 1},$${off + 2},$${off + 3},$${off + 4},$${off + 5},$${off + 6},$${off + 7},$${off + 8},$${off + 9},$${off + 10})`;
      });
      await pg.query(
        `INSERT INTO bench_revision (rootid, prev_id, page_id, username, timestamp, comment, content, date, time, date_time) VALUES ${phs.join(",")}`,
        vals,
      );
    }
  });
  R.insert = tInsert;

  emit({
    step: "pg_rel_select",
    message: "[1/3] PG Relational — SELECT * (JOIN 3 tables)...",
  });
  const { time: tAll, result: rAll } = await timer(() =>
    pg.query(
      `SELECT r.*, p.page_title, p.rootid AS page_rootid, c.name AS category FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id`,
    ),
  );
  R.selectAll = tAll;

  emit({
    step: "pg_rel_filter",
    message: "[1/3] PG Relational — SELECT filter (no index)...",
  });
  const { time: tFilter, result: rFilter } = await timer(() =>
    pg.query(
      `SELECT r.*, p.page_title, c.name AS category FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id WHERE c.name = $1`,
      [FILTER_CATEGORY],
    ),
  );
  R.selectFilter = tFilter;

  emit({
    step: "pg_rel_index",
    message: "[1/3] PG Relational — CREATE INDEX (B-Tree)...",
  });
  const { time: tIdx } = await timer(() =>
    pg.query("CREATE INDEX idx_bench_page_cat ON bench_page(category_id)"),
  );
  R.createIndex = tIdx;

  emit({
    step: "pg_rel_indexed",
    message: "[1/3] PG Relational — SELECT filter (with index)...",
  });
  const { time: tIdxQ, result: rIdxQ } = await timer(() =>
    pg.query(
      `SELECT r.*, p.page_title, c.name AS category FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id WHERE c.name = $1`,
      [FILTER_CATEGORY],
    ),
  );
  R.selectIndexed = tIdxQ;

  emit({
    step: "pg_rel_update",
    message: "[1/3] PG Relational — UPDATE 1 row...",
  });
  const { time: tUpd } = await timer(() =>
    pg.query("UPDATE bench_revision SET comment = $1 WHERE id = 1", [
      "updated_comment",
    ]),
  );
  R.update = tUpd;

  emit({
    step: "pg_rel_delete",
    message: "[1/3] PG Relational — DELETE 1 row...",
  });
  const { time: tDel } = await timer(() =>
    pg.query("DELETE FROM bench_revision WHERE id = 1"),
  );
  R.delete = tDel;

  emit({
    step: "pg_rel_storage",
    message: "[1/3] PG Relational — Measuring storage...",
  });
  const sz = await pg.query(
    `SELECT (pg_table_size('bench_category') + pg_table_size('bench_page') + pg_table_size('bench_revision')) AS data, (pg_indexes_size('bench_category') + pg_indexes_size('bench_page') + pg_indexes_size('bench_revision')) AS idx, (pg_total_relation_size('bench_category') + pg_total_relation_size('bench_page') + pg_total_relation_size('bench_revision')) AS total`,
  );
  R.storage = {
    data: parseInt(sz.rows[0].data),
    index: parseInt(sz.rows[0].idx),
    total: parseInt(sz.rows[0].total),
  };
  R.rowCounts = {
    insert: categories.length + pages.length + revisions.length,
    selectAll: rAll.rowCount,
    selectFilter: rFilter.rowCount,
    selectIndexed: rIdxQ.rowCount,
    update: 1,
    delete: 1,
  };

  const explainFilter = await pg.query(
    `EXPLAIN (ANALYZE, FORMAT JSON) SELECT r.*, p.page_title, c.name AS category FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id WHERE c.name = $1`,
    [FILTER_CATEGORY],
  );
  const explainIndexed = await pg.query(
    `EXPLAIN (ANALYZE, FORMAT JSON) SELECT r.*, p.page_title, c.name AS category FROM bench_revision r JOIN bench_page p ON r.page_id = p.id JOIN bench_category c ON p.category_id = c.id WHERE c.name = $1`,
    [FILTER_CATEGORY],
  );
  R.explainPlans = {
    selectFilter: explainFilter.rows[0]["QUERY PLAN"],
    selectIndexed: explainIndexed.rows[0]["QUERY PLAN"],
  };

  return R;
}

async function benchMongo(db, flatRows, emit) {
  const R = {};
  const col = db.collection("bench_mongo");
  await col.drop().catch(() => {});

  emit({
    step: "mongo_insert",
    message: "[2/3] MongoDB — INSERT " + flatRows.length + " docs...",
  });
  const { time: tInsert } = await timer(async () => {
    const docs = flatRows.map((row, i) => ({ _seq: i + 1, ...row }));
    await col.insertMany(docs, { ordered: false });
  });
  R.insert = tInsert;

  emit({
    step: "mongo_select",
    message: "[2/3] MongoDB — SELECT * (find all)...",
  });
  const { time: tAll, result: rAll } = await timer(() =>
    col.find({}).toArray(),
  );
  R.selectAll = tAll;

  emit({
    step: "mongo_filter",
    message: "[2/3] MongoDB — SELECT filter (no index)...",
  });
  const { time: tFilter, result: rFilter } = await timer(() =>
    col.find({ category: FILTER_CATEGORY }).toArray(),
  );
  R.selectFilter = tFilter;

  emit({
    step: "mongo_index",
    message: "[2/3] MongoDB — CREATE INDEX (B-Tree)...",
  });
  const { time: tIdx } = await timer(() => col.createIndex({ category: 1 }));
  R.createIndex = tIdx;

  emit({
    step: "mongo_indexed",
    message: "[2/3] MongoDB — SELECT filter (with index)...",
  });
  const { time: tIdxQ, result: rIdxQ } = await timer(() =>
    col.find({ category: FILTER_CATEGORY }).toArray(),
  );
  R.selectIndexed = tIdxQ;

  emit({ step: "mongo_update", message: "[2/3] MongoDB — UPDATE 1 doc..." });
  const { time: tUpd } = await timer(() =>
    col.updateOne({ _seq: 1 }, { $set: { comment: "updated_comment" } }),
  );
  R.update = tUpd;

  emit({ step: "mongo_delete", message: "[2/3] MongoDB — DELETE 1 doc..." });
  const { time: tDel } = await timer(() => col.deleteOne({ _seq: 1 }));
  R.delete = tDel;

  emit({
    step: "mongo_storage",
    message: "[2/3] MongoDB — Measuring storage...",
  });
  const stats = await db.command({ collStats: "bench_mongo" });
  R.storage = {
    data: stats.size || 0,
    index: stats.totalIndexSize || 0,
    total: (stats.size || 0) + (stats.totalIndexSize || 0),
  };
  R.rowCounts = {
    insert: flatRows.length,
    selectAll: rAll.length,
    selectFilter: rFilter.length,
    selectIndexed: rIdxQ.length,
    update: 1,
    delete: 1,
  };
  return R;
}

async function benchPgJsonb(pg, flatRows, emit) {
  const R = {};
  await pg.query("DROP TABLE IF EXISTS bench_jsonb");
  await pg.query(
    `CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}')`,
  );

  emit({
    step: "jsonb_insert",
    message: "[3/3] PG JSONB — INSERT " + flatRows.length + " rows...",
  });
  const { time: tInsert } = await timer(async () => {
    for (let i = 0; i < flatRows.length; i += PG_MAX_PARAMS) {
      const batch = flatRows.slice(
        i,
        Math.min(i + PG_MAX_PARAMS, flatRows.length),
      );
      const vals = [];
      const phs = batch.map((row, bi) => {
        vals.push(JSON.stringify(row));
        return `($${bi + 1}::jsonb)`;
      });
      await pg.query(
        `INSERT INTO bench_jsonb (data) VALUES ${phs.join(",")}`,
        vals,
      );
    }
  });
  R.insert = tInsert;

  emit({ step: "jsonb_select", message: "[3/3] PG JSONB — SELECT *..." });
  const { time: tAll, result: rAll } = await timer(() =>
    pg.query("SELECT * FROM bench_jsonb"),
  );
  R.selectAll = tAll;

  emit({
    step: "jsonb_filter",
    message: "[3/3] PG JSONB — SELECT filter (no index)...",
  });
  const { time: tFilter, result: rFilter } = await timer(() =>
    pg.query(`SELECT * FROM bench_jsonb WHERE data->>'category' = $1`, [
      FILTER_CATEGORY,
    ]),
  );
  R.selectFilter = tFilter;

  emit({
    step: "jsonb_btree",
    message: "[3/3] PG JSONB — CREATE B-Tree INDEX...",
  });
  const { time: tBtreeCreate } = await timer(() =>
    pg.query(
      `CREATE INDEX idx_bench_jsonb_btree ON bench_jsonb ((data->>'category'))`,
    ),
  );
  R.createIndex = tBtreeCreate;

  emit({
    step: "jsonb_btree_q",
    message: "[3/3] PG JSONB — SELECT filter (B-Tree)...",
  });
  const { time: tBtreeSelect, result: rBtreeSelect } = await timer(() =>
    pg.query(`SELECT * FROM bench_jsonb WHERE data->>'category' = $1`, [
      FILTER_CATEGORY,
    ]),
  );
  R.selectIndexed = tBtreeSelect;

  emit({
    step: "jsonb_storage",
    message: "[3/3] PG JSONB — Measuring storage (B-Tree)...",
  });
  const szBtree = await pg.query(
    `SELECT pg_table_size('bench_jsonb') AS data, pg_indexes_size('bench_jsonb') AS idx, pg_total_relation_size('bench_jsonb') AS total`,
  );
  R.storage = {
    data: parseInt(szBtree.rows[0].data),
    index: parseInt(szBtree.rows[0].idx),
    total: parseInt(szBtree.rows[0].total),
  };

  await pg.query("DROP INDEX idx_bench_jsonb_btree");

  emit({
    step: "jsonb_gin",
    message: "[3/3] PG JSONB — CREATE GIN INDEX (bonus)...",
  });
  const { time: tGinCreate } = await timer(() =>
    pg.query("CREATE INDEX idx_bench_jsonb_gin ON bench_jsonb USING GIN(data)"),
  );
  R.ginCreateIndex = tGinCreate;

  emit({
    step: "jsonb_gin_q",
    message: "[3/3] PG JSONB — SELECT filter (GIN)...",
  });
  const { time: tGinSelect } = await timer(() =>
    pg.query("SELECT * FROM bench_jsonb WHERE data @> $1::jsonb", [
      JSON.stringify({ category: FILTER_CATEGORY }),
    ]),
  );
  R.ginSelectIndexed = tGinSelect;

  emit({
    step: "jsonb_gin_storage",
    message: "[3/3] PG JSONB — Measuring storage (GIN)...",
  });
  const szGin = await pg.query(
    `SELECT pg_table_size('bench_jsonb') AS data, pg_indexes_size('bench_jsonb') AS idx, pg_total_relation_size('bench_jsonb') AS total`,
  );
  R.ginStorage = {
    data: parseInt(szGin.rows[0].data),
    index: parseInt(szGin.rows[0].idx),
    total: parseInt(szGin.rows[0].total),
  };

  emit({ step: "jsonb_update", message: "[3/3] PG JSONB — UPDATE 1 row..." });
  const { time: tUpd } = await timer(() =>
    pg.query(`UPDATE bench_jsonb SET data = data || $1::jsonb WHERE id = 1`, [
      JSON.stringify({ comment: "updated_comment" }),
    ]),
  );
  R.update = tUpd;

  emit({ step: "jsonb_delete", message: "[3/3] PG JSONB — DELETE 1 row..." });
  const { time: tDel } = await timer(() =>
    pg.query("DELETE FROM bench_jsonb WHERE id = 1"),
  );
  R.delete = tDel;

  R.rowCounts = {
    insert: flatRows.length,
    selectAll: rAll.rowCount,
    selectFilter: rFilter.rowCount,
    selectIndexed: rBtreeSelect.rowCount,
    update: 1,
    delete: 1,
  };

  const explainBtree = await pg.query(
    `EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM bench_jsonb WHERE data->>'category' = $1`,
    [FILTER_CATEGORY],
  );
  R.explainPlans = {
    selectIndexed_btree: explainBtree.rows[0]["QUERY PLAN"],
  };

  return R;
}

async function getStatus() {
  const wikiData = getWikiData();

  let pgOk = false,
    pgVersion = "";
  const pgClient = new Client({ connectionString: PG_URL });
  try {
    await pgClient.connect();
    const res = await pgClient.query("SELECT version()");
    pgVersion = res.rows[0].version.match(/PostgreSQL ([\d.]+)/)?.[1] || "";
    pgOk = true;
  } catch (_) {
  } finally {
    await pgClient.end().catch(() => {});
  }

  let mongoOk = false,
    mongoVersion = "";
  const mongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();
    const info = await mongoClient.db("admin").command({ buildInfo: 1 });
    mongoVersion = info.version || "";
    mongoOk = true;
  } catch (_) {
  } finally {
    await mongoClient.close().catch(() => {});
  }

  const flatRows = buildFlatRows(wikiData.pages, wikiData.revisions);

  const sampleCategories = wikiData.categories.slice(0, 5).map((c, i) => ({
    id: i + 1,
    name: c.name,
    date: c.date,
    time: c.time,
    date_time: c.date_time,
  }));

  const samplePages = wikiData.pages.slice(0, 5).map((p, i) => ({
    id: i + 1,
    rootid: p.rootid,
    category: p.category,
    page_title: p.page_title,
    date: p.date,
    time: p.time,
    date_time: p.date_time,
  }));

  const sampleRevisions = wikiData.revisions.slice(0, 5).map((r, i) => ({
    id: i + 1,
    rootid: r.rootid,
    prev_id: r.prev_id,
    pageid: r.pageid,
    username: r.username,
    timestamp: r.timestamp,
    comment: (r.comment || "").slice(0, 80),
    content_length: (r.content || "").length,
    date: r.date,
    time: r.time,
    date_time: r.date_time,
  }));

  const sampleFlat = flatRows.slice(0, 10).map((f) => ({
    rootid: f.rootid,
    prev_id: f.prev_id,
    page_rootid: f.page_rootid,
    page_title: f.page_title,
    category: f.category,
    username: f.username,
    timestamp: f.timestamp,
    comment: (f.comment || "").slice(0, 80),
    content_length: (f.content || "").length,
    date: f.date,
    time: f.time,
    date_time: f.date_time,
  }));

  return {
    postgres: pgOk,
    pgVersion,
    mongodb: mongoOk,
    mongoVersion,
    wikiData: wikiData.stats,
    sampleData: {
      categories: sampleCategories,
      pages: samplePages,
      revisions: sampleRevisions,
      flatRows: sampleFlat,
    },
  };
}

module.exports = {
  runBenchmark,
  getStatus,
  ensurePgDatabase,
  buildFlatRows,
  buildResult,
  validateRowCounts,
  averageResults,
  timer,
  PG_URL,
  MONGO_URL,
  MONGO_DB,
  DATA_DIR,
  PG_MAX_PARAMS,
  FILTER_CATEGORY,
};
