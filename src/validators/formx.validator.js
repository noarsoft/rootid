const { z } = require('zod');

const createSchema = z.object({
  fk_data_schema: z.number().int().positive(),
  data: z.record(z.unknown()).default({}),
  flag: z.enum(['active', 'archived']).optional(),
  previous_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  data: z.record(z.unknown()).optional(),
  flag: z.enum(['active', 'archived']).optional(),
  previous_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
