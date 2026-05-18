"use strict";

const { parseDateTime } = require("../wikiLoader");

describe("parseDateTime", () => {
  test("converts standard Wikipedia ISO timestamp", () => {
    const result = parseDateTime("2025-07-15T04:56:15Z");
    expect(result).toEqual({
      date: 20250715,
      time: 45615,
      date_time: 20250715045615,
    });
  });

  test("midnight time returns 0", () => {
    const result = parseDateTime("2025-01-01T00:00:00Z");
    expect(result.time).toBe(0);
    expect(result.date).toBe(20250101);
    expect(result.date_time).toBe(20250101000000);
  });

  test("end of day 23:59:59", () => {
    const result = parseDateTime("2024-12-31T23:59:59Z");
    expect(result).toEqual({
      date: 20241231,
      time: 235959,
      date_time: 20241231235959,
    });
  });

  test("single-digit month and day are zero-padded", () => {
    const result = parseDateTime("2025-03-05T09:01:02Z");
    expect(result.date).toBe(20250305);
    expect(result.time).toBe(90102);
    expect(result.date_time).toBe(20250305090102);
  });

  test("date is always an 8-digit integer", () => {
    const result = parseDateTime("2025-01-01T00:00:00Z");
    expect(String(result.date)).toHaveLength(8);
  });

  test("date_time is always a 14-digit BigInt-safe integer", () => {
    const result = parseDateTime("2025-12-31T23:59:59Z");
    expect(String(result.date_time)).toHaveLength(14);
    expect(result.date_time).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });

  test("handles empty string gracefully (returns NaN-based values)", () => {
    const result = parseDateTime("");
    expect(result).toHaveProperty("date");
    expect(result).toHaveProperty("time");
    expect(result).toHaveProperty("date_time");
  });

  test("february leap year date", () => {
    const result = parseDateTime("2024-02-29T12:30:45Z");
    expect(result.date).toBe(20240229);
    expect(result.time).toBe(123045);
  });
});
