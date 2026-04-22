const { z } = require('zod');

const createSchema = z.object({
  data_id: z.number().int().positive(),
  name: z.string().max(255).optional(),
  json_form_config: z.any().default({}),
  flag: z.enum(['draft', 'published']).optional(),
  prev_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  name: z.string().max(255).optional(),
  json_form_config: z.any().optional(),
  flag: z.enum(['draft', 'published']).optional(),
  prev_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
