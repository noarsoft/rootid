const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(1).max(255),
  json: z.any().default({}),
  business_id: z.number().int().positive().optional(),
  flag: z.enum(['draft', 'published', 'archived']).optional(),
  prev_id: z.number().int().positive().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  json: z.any().optional(),
  business_id: z.number().int().positive().optional(),
  flag: z.enum(['draft', 'published', 'archived']).optional(),
  prev_id: z.number().int().positive().optional(),
});

module.exports = { createSchema, updateSchema };
