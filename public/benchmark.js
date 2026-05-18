"use strict";

(function () {
  const $ = (sel) => document.querySelector(sel);
  const themeToggle = $("#themeToggle");
  const runBtn = $("#runBtn");
  const progressPanel = $("#progressPanel");
  const progressSteps = $("#progressSteps");
  const progressFill = $("#progressFill");
  const resultsSection = $("#resultsSection");

  const STEP_LABELS = {
    load: "โหลดข้อมูล Wikipedia",
    flatten: "สร้าง Flat Rows",
    connect: "เชื่อมต่อ PostgreSQL + MongoDB",
    pg_rel: "[1/3] PG Relational — เตรียมตาราง",
    pg_rel_insert: "[1/3] PG Relational — INSERT",
    pg_rel_select: "[1/3] PG Relational — SELECT *",
    pg_rel_filter: "[1/3] PG Relational — SELECT filter",
    pg_rel_index: "[1/3] PG Relational — CREATE INDEX",
    pg_rel_indexed: "[1/3] PG Relational — SELECT (indexed)",
    pg_rel_update: "[1/3] PG Relational — UPDATE",
    pg_rel_delete: "[1/3] PG Relational — DELETE",
    pg_rel_storage: "[1/3] PG Relational — วัด Storage",
    mongo: "[2/3] MongoDB — เตรียม Collection",
    mongo_insert: "[2/3] MongoDB — INSERT",
    mongo_select: "[2/3] MongoDB — SELECT *",
    mongo_filter: "[2/3] MongoDB — SELECT filter",
    mongo_index: "[2/3] MongoDB — CREATE INDEX",
    mongo_indexed: "[2/3] MongoDB — SELECT (indexed)",
    mongo_update: "[2/3] MongoDB — UPDATE",
    mongo_delete: "[2/3] MongoDB — DELETE",
    mongo_storage: "[2/3] MongoDB — วัด Storage",
    pg_jsonb: "[3/3] PG JSONB — เตรียมตาราง",
    jsonb_insert: "[3/3] PG JSONB — INSERT",
    jsonb_select: "[3/3] PG JSONB — SELECT *",
    jsonb_filter: "[3/3] PG JSONB — SELECT filter",
    jsonb_btree: "[3/3] PG JSONB — CREATE B-Tree",
    jsonb_btree_q: "[3/3] PG JSONB — SELECT (B-Tree)",
    jsonb_storage: "[3/3] PG JSONB — วัด Storage (B-Tree)",
    jsonb_gin: "[3/3] PG JSONB — CREATE GIN (bonus)",
    jsonb_gin_q: "[3/3] PG JSONB — SELECT (GIN)",
    jsonb_gin_storage: "[3/3] PG JSONB — วัด Storage (GIN)",
    jsonb_update: "[3/3] PG JSONB — UPDATE",
    jsonb_delete: "[3/3] PG JSONB — DELETE",
    done: "สร้างผลลัพธ์...",
  };

  const ALL_STEPS = Object.keys(STEP_LABELS);

  function initTheme() {
    const saved = localStorage.getItem("bench-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("bench-theme", next);
  });

  async function loadStatus() {
    try {
      const res = await fetch("/api/benchmark/status");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      const d = json.data;

      $("#pgStatus").innerHTML = d.postgres
        ? `<span class="badge badge--ok">Online</span>`
        : `<span class="badge badge--err">Offline</span>`;
      $("#pgVersion").textContent = d.pgVersion ? `v${d.pgVersion}` : "";

      $("#mongoStatus").innerHTML = d.mongodb
        ? `<span class="badge badge--ok">Online</span>`
        : `<span class="badge badge--err">Offline</span>`;
      $("#mongoVersion").textContent = d.mongoVersion ? `v${d.mongoVersion}` : "";

      const w = d.wikiData;
      $("#statCategories").textContent = w.categories.toLocaleString();
      $("#statPages").textContent = w.pages.toLocaleString();
      $("#statRevisions").textContent = w.revisions.toLocaleString();
      $("#statSize").textContent = w.totalSizeMB.toLocaleString();

      if (d.postgres && d.mongodb) {
        runBtn.disabled = false;
      }
    } catch (err) {
      $("#pgStatus").innerHTML = `<span class="badge badge--err">ไม่สามารถเชื่อมต่อ API</span>`;
      $("#mongoStatus").innerHTML = `<span class="badge badge--err">-</span>`;
    }
  }

  let stepIndex = 0;
  function showStep(step) {
    const idx = ALL_STEPS.indexOf(step);
    if (idx >= 0) stepIndex = idx;
    const pct = Math.round(((stepIndex + 1) / ALL_STEPS.length) * 100);
    progressFill.style.width = pct + "%";

    const label = STEP_LABELS[step] || step;
    const div = document.createElement("div");
    div.className = "step active";
    div.innerHTML = `<span class="spinner"></span> ${label}`;

    const prev = progressSteps.querySelector(".step.active");
    if (prev) { prev.className = "step done"; prev.querySelector(".spinner")?.remove(); }

    progressSteps.appendChild(div);
    progressPanel.scrollTop = progressPanel.scrollHeight;
  }

  runBtn.addEventListener("click", () => {
    runBtn.disabled = true;
    progressPanel.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    progressSteps.innerHTML = "";
    progressFill.style.width = "0%";
    stepIndex = 0;

    const evtSource = new EventSource("/api/benchmark/run-sse");
    evtSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.step === "complete") {
        evtSource.close();
        const last = progressSteps.querySelector(".step.active");
        if (last) { last.className = "step done"; last.querySelector(".spinner")?.remove(); }
        progressFill.style.width = "100%";
        renderResults(data.result);
        runBtn.disabled = false;
      } else if (data.step === "error") {
        evtSource.close();
        showStep("error");
        runBtn.disabled = false;
      } else {
        showStep(data.step);
      }
    };
    evtSource.onerror = () => {
      evtSource.close();
      showStep("error");
      const errDiv = progressSteps.querySelector(".step.active");
      if (errDiv) errDiv.textContent = "การเชื่อมต่อขัดข้อง — ลองใหม่อีกครั้ง";
      runBtn.disabled = false;
    };
  });

  let chartTime = null;
  let chartStorage = null;

  function renderResults(result) {
    resultsSection.classList.remove("hidden");

    const ops = ["insert", "selectAll", "selectFilter", "createIndex", "selectIndexed", "update", "delete"];
    const opLabels = { insert: "INSERT (bulk)", selectAll: "SELECT *", selectFilter: "SELECT filter (no index)", createIndex: "CREATE INDEX", selectIndexed: "SELECT filter (indexed)", update: "UPDATE (1 row)", delete: "DELETE (1 row)" };

    const tbody = $("#timeTable tbody");
    tbody.innerHTML = "";
    for (const op of ops) {
      const e = result.execution_time_ms[op];
      const vals = [e.pg_relational, e.mongodb, e.pg_jsonb];
      const minVal = Math.min(...vals);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${opLabels[op]}</td>` + vals.map((v, i) => {
        const cls = v === minVal ? "winner" : "";
        const colorCls = ["color-pg", "color-mongo", "color-jsonb"][i];
        return `<td class="${cls} ${v === minVal ? colorCls : ''}">${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ms</td>`;
      }).join("");
      tbody.appendChild(tr);
    }

    const s = result.storage_bytes;
    const stBody = $("#storageTable tbody");
    stBody.innerHTML = "";
    for (const metric of ["data", "index", "total"]) {
      const tr = document.createElement("tr");
      const vals = [s.pg_relational[metric], s.mongodb[metric], s.pg_jsonb[metric]];
      const minVal = Math.min(...vals);
      tr.innerHTML = `<td>${metric.charAt(0).toUpperCase() + metric.slice(1)}</td>` + vals.map((v, i) => {
        const mb = (v / 1024 / 1024).toFixed(1);
        const cls = v === minVal ? "winner" : "";
        const colorCls = ["color-pg", "color-mongo", "color-jsonb"][i];
        return `<td class="${cls} ${v === minVal ? colorCls : ''}">${mb} MB</td>`;
      }).join("");
      stBody.appendChild(tr);
    }

    const gin = result.bonus_jsonb_gin;
    const ginBody = $("#ginTable tbody");
    ginBody.innerHTML = "";
    ginBody.innerHTML += `<tr><td>CREATE INDEX (ms)</td><td>${result.execution_time_ms.createIndex.pg_jsonb.toFixed(2)}</td><td>${gin.createIndex_ms.toFixed(2)}</td></tr>`;
    ginBody.innerHTML += `<tr><td>SELECT filter (ms)</td><td>${result.execution_time_ms.selectIndexed.pg_jsonb.toFixed(2)}</td><td>${gin.selectIndexed_ms.toFixed(2)}</td></tr>`;
    ginBody.innerHTML += `<tr><td>Index Size (MB)</td><td>${(s.pg_jsonb.index / 1024 / 1024).toFixed(1)}</td><td>${(gin.storage.index / 1024 / 1024).toFixed(1)}</td></tr>`;

    renderCharts(result, ops, opLabels);
  }

  function renderCharts(result, ops, opLabels) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
    const textColor = isDark ? "#e5e7eb" : "#4b5563";

    Chart.defaults.color = textColor;

    if (chartTime) chartTime.destroy();
    if (chartStorage) chartStorage.destroy();

    const pgColor = getComputedStyle(document.documentElement).getPropertyValue("--color-pg").trim();
    const mongoColor = getComputedStyle(document.documentElement).getPropertyValue("--color-mongo").trim();
    const jsonbColor = getComputedStyle(document.documentElement).getPropertyValue("--color-jsonb").trim();

    chartTime = new Chart($("#chartTime"), {
      type: "bar",
      data: {
        labels: ops.map((o) => opLabels[o]),
        datasets: [
          { label: "PG Relational", data: ops.map((o) => result.execution_time_ms[o].pg_relational), backgroundColor: pgColor },
          { label: "MongoDB", data: ops.map((o) => result.execution_time_ms[o].mongodb), backgroundColor: mongoColor },
          { label: "PG JSONB", data: ops.map((o) => result.execution_time_ms[o].pg_jsonb), backgroundColor: jsonbColor },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: { type: "logarithmic", grid: { color: gridColor }, title: { display: true, text: "ms (log scale)" } },
          y: { grid: { display: false } },
        },
        plugins: { legend: { position: "top" } },
      },
    });

    const s = result.storage_bytes;
    chartStorage = new Chart($("#chartStorage"), {
      type: "bar",
      data: {
        labels: ["Data", "Index", "Total"],
        datasets: [
          { label: "PG Relational", data: [s.pg_relational.data, s.pg_relational.index, s.pg_relational.total].map((v) => v / 1024 / 1024), backgroundColor: pgColor },
          { label: "MongoDB", data: [s.mongodb.data, s.mongodb.index, s.mongodb.total].map((v) => v / 1024 / 1024), backgroundColor: mongoColor },
          { label: "PG JSONB", data: [s.pg_jsonb.data, s.pg_jsonb.index, s.pg_jsonb.total].map((v) => v / 1024 / 1024), backgroundColor: jsonbColor },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { grid: { color: gridColor }, title: { display: true, text: "MB" } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { position: "top" } },
      },
    });
  }

  initTheme();
  loadStatus();
})();
