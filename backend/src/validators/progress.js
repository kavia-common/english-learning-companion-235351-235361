const { z } = require('zod');

const progressQuerySchema = z.object({
  userId: z.coerce.number().int().positive(),
});

module.exports = {
  progressQuerySchema,
};
