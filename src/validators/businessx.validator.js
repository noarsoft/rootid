const { z } = require('zod');

const createBusiness = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  icon: z.string().max(100).optional().nullable(),
});

const updateBusiness = z.object({
  name: z.string().min(1).max(255).optional(),
  icon: z.string().max(100).optional().nullable(),
});

module.exports = { createBusiness, updateBusiness };
