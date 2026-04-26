#!/usr/bin/env node
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

app.post('/api/benchmark/run', async (_req, res) => {
  try {
    const data = await runBenchmark();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Benchmark API server running on port ${PORT}`);
});
