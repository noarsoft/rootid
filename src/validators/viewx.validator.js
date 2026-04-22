const { z } = require('zod');

const createSchema = z.object({
  data_schema_id: z.number().int().positive(),
  view_type: z.string().min(1).max(50),
  name: z.string().max(255).optional(),
  json_table_config: z.any().default({}),
  flag: z.enum(['draft', 'published']).optional(),
  prev_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  view_type: z.string().min(1).max(50).optional(),
  name: z.string().max(255).optional(),
  json_table_config: z.any().optional(),
  flag: z.enum(['draft', 'published']).optional(),
  prev_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
