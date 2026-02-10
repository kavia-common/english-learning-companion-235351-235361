const express = require('express');
const healthController = require('../controllers/health');

const lessonsRoutes = require('./lessons');
const quizzesRoutes = require('./quizzes');
const vocabularyRoutes = require('./vocabulary');
const progressRoutes = require('./progress');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Service health checks
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health endpoint (alias)
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/health', healthController.check.bind(healthController));

// API routes
router.use('/api/lessons', lessonsRoutes);
router.use('/api/quizzes', quizzesRoutes);
router.use('/api/vocabulary', vocabularyRoutes);
router.use('/api/progress', progressRoutes);

module.exports = router;

