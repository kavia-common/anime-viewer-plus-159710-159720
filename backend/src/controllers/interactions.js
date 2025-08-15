'use strict';

const interactionsService = require('../services/interactions');

// PUBLIC_INTERFACE
/**
 * Controller handling comments, likes, and tracking interactions.
 * Note: Uses in-memory storage; replace with persistent DB for production.
 */
class InteractionsController {
  /** Get comments */
  async getComments(req, res, next) {
    try {
      const { animeId, episodeId } = req.query;
      const comments = interactionsService.getComments({ animeId, episodeId });
      res.json({ count: comments.length, items: comments });
    } catch (err) {
      next(err);
    }
  }

  /** Create comment */
  async createComment(req, res, next) {
    try {
      const { animeId, episodeId, userId, content } = req.body || {};
      const comment = interactionsService.addComment({
        animeId,
        episodeId,
        userId: userId || 'guest',
        content
      });
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  /** Get likes aggregation (and user liked if userId provided) */
  async getLikes(req, res, next) {
    try {
      const { animeId, userId } = req.query;
      const result = interactionsService.getLikes({ animeId, userId });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /** Set like/unlike */
  async setLike(req, res, next) {
    try {
      const { animeId, userId, like } = req.body || {};
      const result = interactionsService.setLike({
        animeId,
        userId: userId || 'guest',
        like: !!like
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /** Get tracking progress for a user/anime (optionally episode) */
  async getProgress(req, res, next) {
    try {
      const { animeId, userId, episodeId } = req.query;
      const result = interactionsService.getProgress({
        animeId,
        userId: userId || 'guest',
        episodeId
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /** Set tracking progress */
  async setProgress(req, res, next) {
    try {
      const { animeId, episodeId, userId, progressSeconds } = req.body || {};
      const parsedProgress =
        typeof progressSeconds === 'string' ? Number(progressSeconds) : progressSeconds;
      const result = interactionsService.setProgress({
        animeId,
        episodeId,
        userId: userId || 'guest',
        progressSeconds: Number.isFinite(parsedProgress) ? parsedProgress : undefined
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InteractionsController();
