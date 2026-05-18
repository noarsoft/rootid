"use strict";

const {
  buildFlatRows,
  buildResult,
  timer,
  PG_MAX_PARAMS,
  FILTER_CATEGORY,
} = require("../benchCore");

describe("constants", () => {
  test("PG_MAX_PARAMS is 65535", () => {
    expect(PG_MAX_PARAMS).toBe(65535);
  });

  test("FILTER_CATEGORY is computer_science_research", () => {
    expect(FILTER_CATEGORY).toBe("computer_science_research");
  });
});

describe("timer", () => {
  test("returns elapsed time and function result", async () => {
    const { time, result } = await timer(async () => {
      return 42;
    });
    expect(result).toBe(42);
    expect(typeof time).toBe("number");
    expect(time).toBeGreaterThanOrEqual(0);
  });

  test("measures time of async work", async () => {
    const { time } = await timer(
      () => new Promise((resolve) => setTimeout(resolve, 50)),
    );
    expect(time).toBeGreaterThanOrEqual(40);
  });
});

describe("buildFlatRows", () => {
  const categories = [{ name: "cat_a" }, { name: "cat_b" }];
  const pages = [
    {
      rootid: 100,
      category: "cat_a",
      page_title: "Page A",
      date: 20250101,
      time: 120000,
      date_time: 20250101120000,
    },
    {
      rootid: 200,
      category: "cat_b",
      page_title: "Page B",
      date: 20250202,
      time: 130000,
      date_time: 20250202130000,
    },
  ];
  const revisions = [
    {
      rootid: 1,
      prev_id: 0,
      pageid: 100,
      username: "alice",
      timestamp: "2025-01-01T12:00:00Z",
      comment: "first",
      content: "Hello",
      date: 20250101,
      time: 120000,
      date_time: 20250101120000,
    },
    {
      rootid: 2,
      prev_id: 1,
      pageid: 100,
      username: "bob",
      timestamp: "2025-01-02T14:00:00Z",
      comment: "second",
      content: "World",
      date: 20250102,
      time: 140000,
      date_time: 20250102140000,
    },
    {
      rootid: 3,
      prev_id: 0,
      pageid: 200,
      username: "charlie",
      timestamp: "2025-02-02T13:00:00Z",
      comment: "third",
      content: "Foo",
      date: 20250202,
      time: 130000,
      date_time: 20250202130000,
    },
  ];

  test("returns one row per revision", () => {
    const rows = buildFlatRows(pages, revisions);
    expect(rows).toHaveLength(3);
  });

  test("each row has all expected fields", () => {
    const rows = buildFlatRows(pages, revisions);
    const expected = [
      "rootid",
      "prev_id",
      "page_rootid",
      "page_title",
      "category",
      "username",
      "timestamp",
      "comment",
      "content",
      "date",
      "time",
      "date_time",
    ];
    for (const row of rows) {
      for (const field of expected) {
        expect(row).toHaveProperty(field);
      }
    }
  });

  test("joins page data into revision rows", () => {
    const rows = buildFlatRows(pages, revisions);
    expect(rows[0].page_title).toBe("Page A");
    expect(rows[0].category).toBe("cat_a");
    expect(rows[0].page_rootid).toBe(100);
  });

  test("handles revision with unknown pageid", () => {
    const orphanRevs = [
      {
        rootid: 99,
        prev_id: 0,
        pageid: 999,
        username: "ghost",
        timestamp: "",
        comment: "",
        content: "",
        date: 0,
        time: 0,
        date_time: 0,
      },
    ];
    const rows = buildFlatRows(pages, orphanRevs);
    expect(rows).toHaveLength(1);
    expect(rows[0].page_title).toBe("");
    expect(rows[0].category).toBe("");
  });

  test("empty revisions returns empty array", () => {
    const rows = buildFlatRows(pages, []);
    expect(rows).toEqual([]);
  });

  test("preserves revision fields unchanged", () => {
    const rows = buildFlatRows(pages, revisions);
    expect(rows[1].username).toBe("bob");
    expect(rows[1].comment).toBe("second");
    expect(rows[1].content).toBe("World");
    expect(rows[1].rootid).toBe(2);
    expect(rows[1].prev_id).toBe(1);
  });
});

describe("buildResult", () => {
  const mockTimings = {
    insert: 100.123,
    selectAll: 50.456,
    selectFilter: 30.789,
    createIndex: 10.111,
    selectIndexed: 5.222,
    update: 1.333,
    delete: 0.444,
    storage: { data: 1048576, index: 524288, total: 1572864 },
    rowCounts: {
      insert: 100,
      selectAll: 100,
      selectFilter: 10,
      selectIndexed: 10,
      update: 1,
      delete: 1,
    },
  };

  const mockJsonb = {
    ...mockTimings,
    ginCreateIndex: 200.555,
    ginSelectIndexed: 15.666,
    ginStorage: { data: 1048576, index: 2097152, total: 3145728 },
  };

  const mockStats = {
    categories: 58,
    pages: 399,
    revisions: 3657,
    totalSizeMB: 252,
  };

  const mockFlat = [
    {
      rootid: 1,
      prev_id: 0,
      page_rootid: 100,
      page_title: "Test",
      category: "cat",
      username: "user",
      timestamp: "2025-01-01T00:00:00Z",
      comment: "c",
      content: "x".repeat(200),
    },
  ];

  test("returns all required top-level keys", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result).toHaveProperty("execution_time_ms");
    expect(result).toHaveProperty("storage_bytes");
    expect(result).toHaveProperty("bonus_jsonb_gin");
    expect(result).toHaveProperty("row_counts");
    expect(result).toHaveProperty("meta");
    expect(result).toHaveProperty("sampleData");
  });

  test("execution_time_ms has all 7 operations", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    const ops = Object.keys(result.execution_time_ms);
    expect(ops).toEqual([
      "insert",
      "selectAll",
      "selectFilter",
      "createIndex",
      "selectIndexed",
      "update",
      "delete",
    ]);
  });

  test("each op has pg_relational, mongodb, pg_jsonb", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    for (const op of Object.values(result.execution_time_ms)) {
      expect(op).toHaveProperty("pg_relational");
      expect(op).toHaveProperty("mongodb");
      expect(op).toHaveProperty("pg_jsonb");
    }
  });

  test("timing values are rounded to 2 decimal places", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result.execution_time_ms.insert.pg_relational).toBe(100.12);
    expect(result.execution_time_ms.selectAll.mongodb).toBe(50.46);
  });

  test("storage_bytes has all 3 engines", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result.storage_bytes).toHaveProperty("pg_relational");
    expect(result.storage_bytes).toHaveProperty("mongodb");
    expect(result.storage_bytes).toHaveProperty("pg_jsonb");
  });

  test("bonus_jsonb_gin includes GIN metrics", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result.bonus_jsonb_gin.createIndex_ms).toBe(200.56);
    expect(result.bonus_jsonb_gin.selectIndexed_ms).toBe(15.67);
    expect(result.bonus_jsonb_gin.storage).toEqual(mockJsonb.ginStorage);
  });

  test("meta contains stats and timestamp", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result.meta.categories).toBe(58);
    expect(result.meta.pages).toBe(399);
    expect(result.meta.revisions).toBe(3657);
    expect(result.meta.timestamp).toBeDefined();
  });

  test("sampleData truncates comment to 80 chars", () => {
    const longCommentFlat = [
      {
        ...mockFlat[0],
        comment: "a".repeat(200),
      },
    ];
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      longCommentFlat,
    );
    expect(result.sampleData[0].comment).toHaveLength(80);
  });

  test("sampleData includes content_length not content", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result.sampleData[0]).not.toHaveProperty("content");
    expect(result.sampleData[0].content_length).toBe(200);
  });

  test("sampleData limited to first 5 rows", () => {
    const manyRows = Array.from({ length: 20 }, (_, i) => ({
      ...mockFlat[0],
      rootid: i,
    }));
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      manyRows,
    );
    expect(result.sampleData).toHaveLength(5);
  });

  test("row_counts update and delete are always 1", () => {
    const result = buildResult(
      mockTimings,
      mockTimings,
      mockJsonb,
      mockStats,
      mockFlat,
    );
    expect(result.row_counts.update).toEqual({
      pg_relational: 1,
      mongodb: 1,
      pg_jsonb: 1,
    });
    expect(result.row_counts.delete).toEqual({
      pg_relational: 1,
      mongodb: 1,
      pg_jsonb: 1,
    });
  });
});
