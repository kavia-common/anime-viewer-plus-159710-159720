'use strict';

const express = require('express');
const animeController = require('../controllers/anime');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Anime
 *     description: Anime catalog, info, episodes, and stream endpoints
 */

/**
 * @swagger
 * /api/anime/search:
 *   get:
 *     tags: [Anime]
 *     summary: Search anime by query
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         required: true
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         required: false
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', animeController.search.bind(animeController));

/**
 * @swagger
 * /api/anime/trending:
 *   get:
 *     tags: [Anime]
 *     summary: Get trending/top-airing anime
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *     responses:
 *       200:
 *         description: Trending anime list
 */
router.get('/trending', animeController.trending.bind(animeController));

/**
 * @swagger
 * /api/anime/recent:
 *   get:
 *     tags: [Anime]
 *     summary: Get recent episodes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: type
 *         schema: { type: integer, enum: [1,2], default: 1 }
 *         description: 1=sub, 2=dub
 *     responses:
 *       200:
 *         description: Recent episodes feed
 */
router.get('/recent', animeController.recent.bind(animeController));

/**
 * @swagger
 * /api/anime/{id}:
 *   get:
 *     tags: [Anime]
 *     summary: Get anime info by id (includes episodes)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Anime info
 */
router.get('/:id', animeController.info.bind(animeController));

/**
 * @swagger
 * /api/anime/episode/{episodeId}/sources:
 *   get:
 *     tags: [Anime]
 *     summary: Get episode streaming sources
 *     parameters:
 *       - in: path
 *         name: episodeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Streaming sources
 */
router.get('/episode/:episodeId/sources', animeController.episodeSources.bind(animeController));

/**
 * @swagger
 * /api/anime/episode/{episodeId}/redirect:
 *   get:
 *     tags: [Anime]
 *     summary: Redirect to stream URL for episode
 *     parameters:
 *       - in: path
 *         name: episodeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: quality
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       302:
 *         description: Redirecting to stream URL
 */
router.get('/episode/:episodeId/redirect', animeController.episodeRedirect.bind(animeController));

/**
 * @swagger
 * /api/anime/episode/{episodeId}/stream:
 *   get:
 *     tags: [Anime]
 *     summary: Stream-proxy episode source
 *     description: Proxies the selected source. Best for HLS(m3u8). Not optimized for mp4 seeking.
 *     parameters:
 *       - in: path
 *         name: episodeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: quality
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stream data
 */
router.get('/episode/:episodeId/stream', animeController.episodeStream.bind(animeController));

module.exports = router;
