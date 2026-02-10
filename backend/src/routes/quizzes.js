const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const quizzesController = require('../controllers/quizzes');
const { generateQuizBodySchema, quizIdParamsSchema, submitQuizBodySchema } = require('../validators/quizzes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Quizzes
 *     description: Quiz generation, retrieval, and submissions
 */

/**
 * @swagger
 * /api/quizzes/generate:
 *   post:
 *     tags: [Quizzes]
 *     summary: Generate quiz for a lesson
 *     description: Creates (or regenerates) a quiz for a given lesson and persists it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateQuizRequest'
 *     responses:
 *       200:
 *         description: Quiz generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 */
router.post(
  '/generate',
  validate({ body: generateQuizBodySchema }),
  asyncHandler(quizzesController.generate.bind(quizzesController))
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get quiz with questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */
router.get(
  '/:id',
  validate({ params: quizIdParamsSchema }),
  asyncHandler(quizzesController.getById.bind(quizzesController))
);

/**
 * @swagger
 * /api/quizzes/{id}/submit:
 *   post:
 *     tags: [Quizzes]
 *     summary: Submit quiz answers and score
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitQuizRequest'
 *     responses:
 *       200:
 *         description: Submission result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/QuizSubmissionResult'
 */
router.post(
  '/:id/submit',
  validate({ params: quizIdParamsSchema, body: submitQuizBodySchema }),
  asyncHandler(quizzesController.submit.bind(quizzesController))
);

module.exports = router;

