const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const vocabularyController = require('../controllers/vocabulary');
const { vocabularyListQuerySchema, upsertVocabularyBodySchema, reviewVocabularyBodySchema } = require('../validators/vocabulary');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Vocabulary
 *     description: User vocabulary and review schedules
 */

/**
 * @swagger
 * /api/vocabulary:
 *   get:
 *     tags: [Vocabulary]
 *     summary: List vocabulary for a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vocabulary list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vocabulary:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VocabularyItem'
 */
router.get(
  '/',
  validate({ query: vocabularyListQuerySchema }),
  asyncHandler(vocabularyController.list.bind(vocabularyController))
);

/**
 * @swagger
 * /api/vocabulary:
 *   post:
 *     tags: [Vocabulary]
 *     summary: Upsert a vocabulary item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertVocabularyRequest'
 *     responses:
 *       200:
 *         description: Upserted vocabulary item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vocabulary:
 *                   $ref: '#/components/schemas/VocabularyItem'
 */
router.post(
  '/',
  validate({ body: upsertVocabularyBodySchema }),
  asyncHandler(vocabularyController.upsert.bind(vocabularyController))
);

/**
 * @swagger
 * /api/vocabulary/review:
 *   post:
 *     tags: [Vocabulary]
 *     summary: Schedule/update review based on result
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VocabularyReviewRequest'
 *     responses:
 *       200:
 *         description: Updated schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedule:
 *                   $ref: '#/components/schemas/ReviewSchedule'
 */
router.post(
  '/review',
  validate({ body: reviewVocabularyBodySchema }),
  asyncHandler(vocabularyController.review.bind(vocabularyController))
);

module.exports = router;

