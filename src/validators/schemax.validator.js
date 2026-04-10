const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(1).max(255),
  json: z.record(z.unknown()).default({}),
  flag: z.enum(['draft', 'published', 'archived']).optional(),
  previous_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  json: z.record(z.unknown()).optional(),
  flag: z.enum(['draft', 'published', 'archived']).optional(),
  previous_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
