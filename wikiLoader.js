'use strict';

const fs = require('fs');
const path = require('path');

function parseDateTime(isoTimestamp) {
  const d = new Date(isoTimestamp);
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dy = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const mi = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');

  const date = parseInt(`${y}${mo}${dy}`);
  const time = parseInt(`${h}${mi}${s}`);
  const date_time = parseInt(`${y}${mo}${dy}${h}${mi}${s}`);

  return { date, time, date_time };
}

function loadWikiData(dataDir) {
  const categoryNames = fs.readdirSync(dataDir).filter(name =>
    fs.statSync(path.join(dataDir, name)).isDirectory()
  ).sort();

  const categories = [];
  const pageMap = new Map();
  const revisions = [];
  let fileCount = 0;
  let totalSizeBytes = 0;

  for (const category of categoryNames) {
    const catDir = path.join(dataDir, category);
    const jsonFiles = fs.readdirSync(catDir).filter(f => f.endsWith('.json'));

    let catFirstTimestamp = null;

    for (const file of jsonFiles) {
      const filePath = path.join(catDir, file);
      totalSizeBytes += fs.statSync(filePath).size;
      fileCount++;

      const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const pages = raw.query?.pages;
      if (!pages) continue;

      for (const page of Object.values(pages)) {
        const revs = page.revisions;
        if (!revs || revs.length === 0) continue;

        const pageid = page.pageid;
        if (!pageMap.has(pageid)) {
          const firstTs = revs[0].timestamp || '';
          const dt = parseDateTime(firstTs);
          pageMap.set(pageid, {
            rootid: pageid,
            category,
            page_title: page.title || '',
            ...dt,
          });
          if (!catFirstTimestamp) catFirstTimestamp = firstTs;
        }

        for (const rev of revs) {
          const dt = parseDateTime(rev.timestamp || '');
          revisions.push({
            rootid: rev.revid || 0,
            prev_id: rev.parentid || 0,
            pageid,
            username: rev.user || '',
            timestamp: rev.timestamp || '',
            comment: rev.comment || '',
            content: rev['*'] || '',
            ...dt,
          });
        }
      }
    }

    const dt = catFirstTimestamp ? parseDateTime(catFirstTimestamp) : { date: 0, time: 0, date_time: 0 };
    categories.push({ name: category, ...dt });
  }

  const pages = [...pageMap.values()];

  return {
    categories,
    pages,
    revisions,
    stats: {
      categories: categories.length,
      pages: pages.length,
      revisions: revisions.length,
      files: fileCount,
      totalSizeMB: Math.round(totalSizeBytes / (1024 * 1024)),
    },
  };
}

module.exports = { loadWikiData, parseDateTime };
