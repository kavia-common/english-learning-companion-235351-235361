const { z } = require('zod');

const generateQuizBodySchema = z.object({
  lessonId: z.number().int().positive(),
});

const quizIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const submitQuizBodySchema = z.object({
  userId: z.number().int().positive(),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        answer: z.string().min(1),
      })
    )
    .min(1),
});

module.exports = {
  generateQuizBodySchema,
  quizIdParamsSchema,
  submitQuizBodySchema,
};
