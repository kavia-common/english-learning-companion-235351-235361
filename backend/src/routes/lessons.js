const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const lessonsController = require('../controllers/lessons');
const { getLessonParamsSchema } = require('../validators/lessons');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Lessons
 *     description: Lesson listing and detail
 */

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     tags: [Lessons]
 *     summary: List lessons
 *     description: Returns a list of lessons (id, title, difficulty, summary).
 *     responses:
 *       200:
 *         description: Lessons list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lessons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LessonListItem'
 */
router.get('/', asyncHandler(lessonsController.list.bind(lessonsController)));

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     tags: [Lessons]
 *     summary: Get lesson detail
 *     description: Returns a lesson including content_json.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lesson:
 *                   $ref: '#/components/schemas/LessonDetail'
 *       404:
 *         description: Lesson not found
 */
router.get(
  '/:id',
  validate({ params: getLessonParamsSchema }),
  asyncHandler(lessonsController.getById.bind(lessonsController))
);

module.exports = router;

