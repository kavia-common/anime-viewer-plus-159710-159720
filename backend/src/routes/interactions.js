'use strict';

const express = require('express');
const interactionsController = require('../controllers/interactions');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Interactions
 *     description: Comments, likes, and episode tracking
 */

/**
 * @swagger
 * /api/interactions/comments:
 *   get:
 *     tags: [Interactions]
 *     summary: List comments
 *     parameters:
 *       - in: query
 *         name: animeId
 *         required: false
 *         schema: { type: string }
 *       - in: query
 *         name: episodeId
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/comments', interactionsController.getComments.bind(interactionsController));

/**
 * @swagger
 * /api/interactions/comments:
 *   post:
 *     tags: [Interactions]
 *     summary: Create a comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [animeId, content]
 *             properties:
 *               animeId: { type: string, description: Anime identifier }
 *               episodeId: { type: string, nullable: true, description: Optional episode identifier }
 *               userId: { type: string, description: User identifier (defaults to 'guest') }
 *               content: { type: string, description: Comment text }
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/comments', interactionsController.createComment.bind(interactionsController));

/**
 * @swagger
 * /api/interactions/likes:
 *   get:
 *     tags: [Interactions]
 *     summary: Get likes for an anime (and whether a user liked)
 *     parameters:
 *       - in: query
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Likes info
 */
router.get('/likes', interactionsController.getLikes.bind(interactionsController));

/**
 * @swagger
 * /api/interactions/likes:
 *   post:
 *     tags: [Interactions]
 *     summary: Like or unlike an anime
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [animeId, like]
 *             properties:
 *               animeId: { type: string }
 *               userId: { type: string, description: Defaults to 'guest' }
 *               like: { type: boolean, description: true to like, false to unlike }
 *     responses:
 *       200:
 *         description: Updated like status
 */
router.post('/likes', interactionsController.setLike.bind(interactionsController));

/**
 * @swagger
 * /api/interactions/tracking:
 *   get:
 *     tags: [Interactions]
 *     summary: Get playback progress
 *     parameters:
 *       - in: query
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         required: false
 *         schema: { type: string, default: 'guest' }
 *       - in: query
 *         name: episodeId
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Progress record or list
 */
router.get('/tracking', interactionsController.getProgress.bind(interactionsController));

/**
 * @swagger
 * /api/interactions/tracking:
 *   post:
 *     tags: [Interactions]
 *     summary: Set playback progress
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [animeId, episodeId, progressSeconds]
 *             properties:
 *               animeId: { type: string }
 *               episodeId: { type: string }
 *               userId: { type: string, default: 'guest' }
 *               progressSeconds: { type: number }
 *     responses:
 *       200:
 *         description: Updated progress
 */
router.post('/tracking', interactionsController.setProgress.bind(interactionsController));

module.exports = router;
