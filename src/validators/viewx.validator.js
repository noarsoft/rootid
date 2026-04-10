const { z } = require('zod');

const createSchema = z.object({
  fk_data_schema: z.number().int().positive(),
  view_type: z.string().min(1).max(50),
  name: z.string().max(255).optional(),
  json: z.record(z.unknown()).default({}),
  flag: z.enum(['draft', 'published']).optional(),
  previous_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  view_type: z.string().min(1).max(50).optional(),
  name: z.string().max(255).optional(),
  json: z.record(z.unknown()).optional(),
  flag: z.enum(['draft', 'published']).optional(),
  previous_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
