const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const progressController = require('../controllers/progress');
const { progressQuerySchema } = require('../validators/progress');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Progress
 *     description: Aggregated learning progress
 */

/**
 * @swagger
 * /api/progress:
 *   get:
 *     tags: [Progress]
 *     summary: Get aggregated progress summary for user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progress summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   $ref: '#/components/schemas/ProgressSummary'
 */
router.get(
  '/',
  validate({ query: progressQuerySchema }),
  asyncHandler(progressController.getSummary.bind(progressController))
);

module.exports = router;

