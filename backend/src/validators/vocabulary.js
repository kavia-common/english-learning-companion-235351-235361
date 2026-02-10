const { z } = require('zod');

const vocabularyListQuerySchema = z.object({
  userId: z.coerce.number().int().positive(),
});

const upsertVocabularyBodySchema = z.object({
  userId: z.number().int().positive(),
  term: z.string().min(1).max(200),
  definition: z.string().min(1).max(2000),
  example: z.string().min(1).max(2000),
});

const reviewVocabularyBodySchema = z.object({
  userId: z.number().int().positive(),
  term: z.string().min(1).max(200),
  result: z.enum(['pass', 'fail']),
});

module.exports = {
  vocabularyListQuerySchema,
  upsertVocabularyBodySchema,
  reviewVocabularyBodySchema,
};
