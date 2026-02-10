const { z } = require('zod');

const getLessonParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = {
  getLessonParamsSchema,
};
