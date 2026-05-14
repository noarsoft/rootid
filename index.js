#!/usr/bin/env node
'use strict';

require('dotenv').config();
const { runBenchmark } = require('./benchCore');

async function main() {
  console.log('🚀 Starting DB Benchmark (Relational vs Mongo vs JSONB)...');
  console.log('Using Wikipedia data from ./data/json\n');

  try {
    const data = await runBenchmark();
    
    console.log('✅ Benchmark Completed!\n');

    // Display summary table
    const t = data.execution_time_ms;
    const summary = [
      { Operation: 'INSERT (bulk)', PG_Rel: t.insert.pg_relational.toFixed(2) + 'ms', Mongo: t.insert.mongodb.toFixed(2) + 'ms', JSONB: t.insert.pg_jsonb.toFixed(2) + 'ms' },
      { Operation: 'SELECT *', PG_Rel: t.selectAll.pg_relational.toFixed(2) + 'ms', Mongo: t.selectAll.mongodb.toFixed(2) + 'ms', JSONB: t.selectAll.pg_jsonb.toFixed(2) + 'ms' },
      { Operation: 'SELECT filter', PG_Rel: t.selectFilter.pg_relational.toFixed(2) + 'ms', Mongo: t.selectFilter.mongodb.toFixed(2) + 'ms', JSONB: t.selectFilter.pg_jsonb.toFixed(2) + 'ms' },
      { Operation: 'CREATE Index', PG_Rel: t.createIndex.pg_relational.toFixed(2) + 'ms', Mongo: t.createIndex.mongodb.toFixed(2) + 'ms', JSONB: t.createIndex.pg_jsonb.toFixed(2) + 'ms' },
      { Operation: 'SELECT indexed', PG_Rel: t.selectIndexed.pg_relational.toFixed(2) + 'ms', Mongo: t.selectIndexed.mongodb.toFixed(2) + 'ms', JSONB: t.selectIndexed.pg_jsonb.toFixed(2) + 'ms' },
      { Operation: 'UPDATE (1 row)', PG_Rel: t.update.pg_relational.toFixed(2) + 'ms', Mongo: t.update.mongodb.toFixed(2) + 'ms', JSONB: t.update.pg_jsonb.toFixed(2) + 'ms' },
      { Operation: 'DELETE (1 row)', PG_Rel: t.delete.pg_relational.toFixed(2) + 'ms', Mongo: t.delete.mongodb.toFixed(2) + 'ms', JSONB: t.delete.pg_jsonb.toFixed(2) + 'ms' },
    ];

    console.table(summary);

    const sb = data.storage_bytes;
    console.log('\n📦 Storage Summary:');
    console.log(`PG Relational: ${(sb.pg_relational.total / 1024 / 1024).toFixed(2)} MB`);
    console.log(`MongoDB:       (${(sb.mongodb.total / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`PG JSONB:      (${(sb.pg_jsonb.total / 1024 / 1024).toFixed(2)} MB)`);

    console.log('\nResults saved to results.csv and result_wiki_*.json');
  } catch (err) {
    console.error('\n❌ Benchmark Failed:');
    console.error(err);
    process.exit(1);
  }
}

main();
