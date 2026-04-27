'use strict';

const path = require('path');
const { Client } = require('pg');
const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');
const { loadWikiData } = require('./wikiLoader');

const PG_URL = process.env.PG_URL || 'postgresql://postgres:postgres@localhost:5432/benchmark';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'benchmark';
const DATA_DIR = path.join(__dirname, 'data', 'json');

async function timer(fn) {
  const start = performance.now();
  const result = await fn();
  return { time: performance.now() - start, result };
}

function buildFlatRows(categories, pages, revisions) {
  const pageMap = new Map();
  pages.forEach(p => pageMap.set(p.rootid, p));

  return revisions.map(rev => {
    const pg = pageMap.get(rev.pageid) || {};
    return {
      rootid: rev.rootid,
      prev_id: rev.prev_id,
      page_rootid: rev.pageid,
      page_title: pg.page_title || '',
      category: pg.category || '',
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
  url.pathname = '/postgres';

  const client = new Client({ connectionString: url.toString() });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
    }
  } finally {
    await client.end();
  }
}

async function benchPgRelational(pg, categories, pages, rawRevisions) {
  const seen = new Set();
  const revisions = rawRevisions.filter(r => { if (seen.has(r.rootid)) return false; seen.add(r.rootid); return true; });
  const R = {};

  await pg.query('DROP TABLE IF EXISTS bench_revision');
  await pg.query('DROP TABLE IF EXISTS bench_page');
  await pg.query('DROP TABLE IF EXISTS bench_category');

  await pg.query(`CREATE TABLE bench_category (
    id SERIAL PRIMARY KEY,
    rootid UUID UNIQUE DEFAULT gen_random_uuid(),
    prev_id INTEGER,
    name VARCHAR(100),
    date INTEGER,
    time INTEGER,
    date_time BIGINT
  )`);

  await pg.query(`CREATE TABLE bench_page (
    id SERIAL PRIMARY KEY,
    rootid INTEGER UNIQUE NOT NULL,
    prev_id INTEGER,
    category_id INTEGER REFERENCES bench_category(id),
    page_title VARCHAR(500),
    date INTEGER,
    time INTEGER,
    date_time BIGINT
  )`);

  await pg.query(`CREATE TABLE bench_revision (
    id SERIAL PRIMARY KEY,
    rootid INTEGER UNIQUE NOT NULL,
    prev_id INTEGER,
    page_id INTEGER REFERENCES bench_page(id),
    username VARCHAR(255),
    timestamp VARCHAR(30),
    comment TEXT,
    content TEXT,
    date INTEGER,
    time INTEGER,
    date_time BIGINT
  )`);

  const { time: tInsert } = await timer(async () => {
    const catVals = [];
    const catPhs = categories.map((c, i) => {
      const off = i * 4;
      catVals.push(c.name, c.date, c.time, c.date_time);
      return `($${off + 1}, $${off + 2}, $${off + 3}, $${off + 4})`;
    });
    await pg.query(
      `INSERT INTO bench_category (name, date, time, date_time) VALUES ${catPhs.join(',')}`,
      catVals
    );

    const catRows = await pg.query('SELECT id, name FROM bench_category');
    const catIdMap = new Map();
    catRows.rows.forEach(r => catIdMap.set(r.name, r.id));

    const maxPageBatch = Math.floor(65535 / 6);
    for (let i = 0; i < pages.length; i += maxPageBatch) {
      const batch = pages.slice(i, Math.min(i + maxPageBatch, pages.length));
      const vals = [];
      const phs = batch.map((p, bi) => {
        const off = bi * 6;
        vals.push(p.rootid, catIdMap.get(p.category), p.page_title, p.date, p.time, p.date_time);
        return `($${off + 1}, $${off + 2}, $${off + 3}, $${off + 4}, $${off + 5}, $${off + 6})`;
      });
      await pg.query(
        `INSERT INTO bench_page (rootid, category_id, page_title, date, time, date_time) VALUES ${phs.join(',')}`,
        vals
      );
    }

    const pageRows = await pg.query('SELECT id, rootid FROM bench_page');
    const pageIdMap = new Map();
    pageRows.rows.forEach(r => pageIdMap.set(r.rootid, r.id));

    const maxRevBatch = Math.floor(65535 / 9);
    for (let i = 0; i < revisions.length; i += maxRevBatch) {
      const batch = revisions.slice(i, Math.min(i + maxRevBatch, revisions.length));
      const vals = [];
      const phs = batch.map((rev, bi) => {
        const off = bi * 9;
        vals.push(
          rev.rootid, rev.prev_id, pageIdMap.get(rev.pageid),
          rev.username, rev.timestamp, rev.comment, rev.content,
          rev.date, rev.date_time
        );
        return `($${off + 1}, $${off + 2}, $${off + 3}, $${off + 4}, $${off + 5}, $${off + 6}, $${off + 7}, $${off + 8}, $${off + 9})`;
      });
      await pg.query(
        `INSERT INTO bench_revision (rootid, prev_id, page_id, username, timestamp, comment, content, date, date_time) VALUES ${phs.join(',')}`,
        vals
      );
    }
  });
  R.insert = tInsert;

  const { time: tAll } = await timer(() => pg.query(`
    SELECT r.*, p.page_title, p.rootid AS page_rootid, c.name AS category
    FROM bench_revision r
    JOIN bench_page p ON r.page_id = p.id
    JOIN bench_category c ON p.category_id = c.id
  `));
  R.selectAll = tAll;

  const filterCat = 'computer_science_research';
  const { time: tFilter } = await timer(() => pg.query(`
    SELECT r.*, p.page_title, c.name AS category
    FROM bench_revision r
    JOIN bench_page p ON r.page_id = p.id
    JOIN bench_category c ON p.category_id = c.id
    WHERE c.name = $1
  `, [filterCat]));
  R.selectFilter = tFilter;

  const { time: tIdx } = await timer(() =>
    pg.query('CREATE INDEX idx_bench_page_cat ON bench_page(category_id)')
  );
  R.createIndex = tIdx;

  const { time: tIdxQ } = await timer(() => pg.query(`
    SELECT r.*, p.page_title, c.name AS category
    FROM bench_revision r
    JOIN bench_page p ON r.page_id = p.id
    JOIN bench_category c ON p.category_id = c.id
    WHERE c.name = $1
  `, [filterCat]));
  R.selectIndexed = tIdxQ;

  const { time: tUpd } = await timer(() =>
    pg.query('UPDATE bench_revision SET comment = $1 WHERE id = 1', ['updated_comment'])
  );
  R.update = tUpd;

  const { time: tDel } = await timer(() =>
    pg.query('DELETE FROM bench_revision WHERE id = 1')
  );
  R.delete = tDel;

  const sz = await pg.query(`
    SELECT
      (pg_relation_size('bench_category') + pg_relation_size('bench_page') + pg_relation_size('bench_revision')) AS data,
      (pg_indexes_size('bench_category') + pg_indexes_size('bench_page') + pg_indexes_size('bench_revision')) AS idx,
      (pg_total_relation_size('bench_category') + pg_total_relation_size('bench_page') + pg_total_relation_size('bench_revision')) AS total
  `);
  R.storage = {
    data: parseInt(sz.rows[0].data),
    index: parseInt(sz.rows[0].idx),
    total: parseInt(sz.rows[0].total),
  };

  return R;
}

async function benchPgJsonb(pg, flatRows) {
  const R = {};

  await pg.query('DROP TABLE IF EXISTS bench_jsonb');
  await pg.query(`CREATE TABLE bench_jsonb (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}')`);

  const maxBatch = 65535;
  const { time: tInsert } = await timer(async () => {
    for (let i = 0; i < flatRows.length; i += maxBatch) {
      const batch = flatRows.slice(i, Math.min(i + maxBatch, flatRows.length));
      const vals = [];
      const phs = batch.map((row, bi) => {
        vals.push(JSON.stringify(row));
        return `($${bi + 1}::jsonb)`;
      });
      await pg.query(`INSERT INTO bench_jsonb (data) VALUES ${phs.join(',')}`, vals);
    }
  });
  R.insert = tInsert;

  const { time: tAll } = await timer(() => pg.query('SELECT * FROM bench_jsonb'));
  R.selectAll = tAll;

  const filterCat = 'computer_science_research';
  const { time: tFilter } = await timer(() =>
    pg.query(`SELECT * FROM bench_jsonb WHERE data->>'category' = $1`, [filterCat])
  );
  R.selectFilter = tFilter;

  const { time: tBtreeCreate } = await timer(() =>
    pg.query(`CREATE INDEX idx_bench_jsonb_btree ON bench_jsonb ((data->>'category'))`)
  );
  R.createIndex = tBtreeCreate;

  const { time: tBtreeSelect } = await timer(() =>
    pg.query(`SELECT * FROM bench_jsonb WHERE data->>'category' = $1`, [filterCat])
  );
  R.selectIndexed = tBtreeSelect;

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

  await pg.query('DROP INDEX idx_bench_jsonb_btree');

  const { time: tGinCreate } = await timer(() =>
    pg.query('CREATE INDEX idx_bench_jsonb_gin ON bench_jsonb USING GIN(data)')
  );
  R.ginCreateIndex = tGinCreate;

  const { time: tGinSelect } = await timer(() =>
    pg.query('SELECT * FROM bench_jsonb WHERE data @> $1::jsonb', [JSON.stringify({ category: filterCat })])
  );
  R.ginSelectIndexed = tGinSelect;

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

  const { time: tUpd } = await timer(() =>
    pg.query(`UPDATE bench_jsonb SET data = data || $1::jsonb WHERE id = 1`, [
      JSON.stringify({ comment: 'updated_comment' }),
    ])
  );
  R.update = tUpd;

  const { time: tDel } = await timer(() => pg.query('DELETE FROM bench_jsonb WHERE id = 1'));
  R.delete = tDel;

  return R;
}

async function benchMongo(db, flatRows) {
  const R = {};
  const col = db.collection('bench_mongo');
  await col.drop().catch(() => {});

  const { time: tInsert } = await timer(async () => {
    const docs = flatRows.map((row, i) => ({ _seq: i + 1, ...row }));
    await col.insertMany(docs, { ordered: false });
  });
  R.insert = tInsert;

  const { time: tAll } = await timer(() => col.find({}).toArray());
  R.selectAll = tAll;

  const filterCat = 'computer_science_research';
  const { time: tFilter } = await timer(() => col.find({ category: filterCat }).toArray());
  R.selectFilter = tFilter;

  const { time: tIdx } = await timer(() => col.createIndex({ category: 1 }));
  R.createIndex = tIdx;

  const { time: tIdxQ } = await timer(() => col.find({ category: filterCat }).toArray());
  R.selectIndexed = tIdxQ;

  const { time: tUpd } = await timer(() =>
    col.updateOne({ _seq: 1 }, { $set: { comment: 'updated_comment' } })
  );
  R.update = tUpd;

  const { time: tDel } = await timer(() => col.deleteOne({ _seq: 1 }));
  R.delete = tDel;

  const stats = await db.command({ collStats: 'bench_mongo' });
  R.storage = {
    data: stats.size || 0,
    index: stats.totalIndexSize || 0,
    total: (stats.storageSize || 0) + (stats.totalIndexSize || 0),
  };

  return R;
}

function buildResult(rel, mongo, jsonb, stats) {
  const mainOps = ['insert', 'selectAll', 'selectFilter', 'createIndex', 'selectIndexed', 'update', 'delete'];
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
    meta: {
      categories: stats.categories,
      pages: stats.pages,
      revisions: stats.revisions,
      totalSizeMB: stats.totalSizeMB,
      timestamp: new Date().toISOString(),
    },
  };
}

async function runBenchmark() {
  const wikiData = loadWikiData(DATA_DIR);
  const { categories, pages, revisions, stats } = wikiData;
  const flatRows = buildFlatRows(categories, pages, revisions);

  await ensurePgDatabase();

  const pgClient = new Client({ connectionString: PG_URL });
  await pgClient.connect();

  const mongoClient = new MongoClient(MONGO_URL);
  await mongoClient.connect();
  const mongoDB = mongoClient.db(MONGO_DB);

  try {
    const relResult = await benchPgRelational(pgClient, categories, pages, revisions);
    const mongoResult = await benchMongo(mongoDB, flatRows);
    const jsonbResult = await benchPgJsonb(pgClient, flatRows);

    return buildResult(relResult, mongoResult, jsonbResult, stats);
  } finally {
    await pgClient.end();
    await mongoClient.close();
  }
}

async function getStatus() {
  const wikiData = loadWikiData(DATA_DIR);

  let pgOk = false, pgVersion = '';
  try {
    const pgClient = new Client({ connectionString: PG_URL });
    await pgClient.connect();
    const res = await pgClient.query('SELECT version()');
    pgVersion = res.rows[0].version.match(/PostgreSQL ([\d.]+)/)?.[1] || '';
    pgOk = true;
    await pgClient.end();
  } catch (_) {}

  let mongoOk = false, mongoVersion = '';
  try {
    const mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    const info = await mongoClient.db('admin').command({ buildInfo: 1 });
    mongoVersion = info.version || '';
    mongoOk = true;
    await mongoClient.close();
  } catch (_) {}

  const flatRows = buildFlatRows(wikiData.categories, wikiData.pages, wikiData.revisions);

  const sampleCategories = wikiData.categories.slice(0, 5).map((c, i) => ({
    id: i + 1, name: c.name, date: c.date, time: c.time, date_time: c.date_time,
  }));

  const samplePages = wikiData.pages.slice(0, 5).map((p, i) => ({
    id: i + 1, rootid: p.rootid, category: p.category, page_title: p.page_title,
    date: p.date, time: p.time, date_time: p.date_time,
  }));

  const sampleRevisions = wikiData.revisions.slice(0, 5).map((r, i) => ({
    id: i + 1, rootid: r.rootid, prev_id: r.prev_id, pageid: r.pageid,
    username: r.username, timestamp: r.timestamp,
    comment: (r.comment || '').slice(0, 80),
    content_length: (r.content || '').length,
    date: r.date, time: r.time, date_time: r.date_time,
  }));

  const sampleFlat = flatRows.slice(0, 5).map(f => ({
    rootid: f.rootid, prev_id: f.prev_id, page_rootid: f.page_rootid,
    page_title: f.page_title, category: f.category, username: f.username,
    timestamp: f.timestamp, comment: (f.comment || '').slice(0, 80),
    content_length: (f.content || '').length,
    date: f.date, time: f.time, date_time: f.date_time,
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
  benchPgRelational,
  benchMongo,
  benchPgJsonb,
  buildResult,
  PG_URL,
  MONGO_URL,
  MONGO_DB,
  DATA_DIR,
};
