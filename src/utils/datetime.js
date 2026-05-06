function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const s =
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
  return Number(s);
}

module.exports = { now };
