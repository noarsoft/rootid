const { z } = require('zod');

const createSchema = z.object({
  data_schema_id: z.number().int().positive(),
  data: z.any().default({}),
  flag: z.enum(['active', 'archived']).optional(),
  prev_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  data: z.any().optional(),
  flag: z.enum(['active', 'archived']).optional(),
  prev_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
