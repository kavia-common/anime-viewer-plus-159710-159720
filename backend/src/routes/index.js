const express = require('express');
const healthController = require('../controllers/health');
const animeRoutes = require('./anime');
const interactionsRoutes = require('./interactions');

const router = express.Router();

// Health endpoint
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

// API routes
router.use('/api/anime', animeRoutes);
router.use('/api/interactions', interactionsRoutes);

module.exports = router;
