'use strict';

const animeService = require('../services/anime');

// PUBLIC_INTERFACE
/**
 * Controller for anime catalog, info, episodes, and streaming operations.
 */
class AnimeController {
  /** Search anime by query */
  async search(req, res, next) {
    try {
      const q = req.query.q;
      const page = Number(req.query.page || 1);
      const data = await animeService.search(q, page);
      res.json({ query: q, page, ...data });
    } catch (err) {
      next(err);
    }
  }

  /** Get trending/top-airing anime */
  async trending(req, res, next) {
    try {
      const page = Number(req.query.page || 1);
      const data = await animeService.trending(page);
      res.json({ page, ...data });
    } catch (err) {
      next(err);
    }
  }

  /** Get recent episodes feed */
  async recent(req, res, next) {
    try {
      const page = Number(req.query.page || 1);
      const type = Number(req.query.type || 1);
      const data = await animeService.recent(page, type);
      res.json({ page, type, ...data });
    } catch (err) {
      next(err);
    }
  }

  /** Get anime info (includes episodes) */
  async info(req, res, next) {
    try {
      const { id } = req.params;
      const data = await animeService.info(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /** Get episode streaming sources */
  async episodeSources(req, res, next) {
    try {
      const { episodeId } = req.params;
      const data = await animeService.episodeSources(episodeId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /** Redirect to the first available stream source (simple redirect) */
  async episodeRedirect(req, res, next) {
    try {
      const { episodeId } = req.params;
      const { quality } = req.query;
      const selected = await animeService.selectEpisodeSource(episodeId, quality);
      res.redirect(selected.url);
    } catch (err) {
      next(err);
    }
  }

  /** Proxy stream of selected source (basic, good for m3u8) */
  async episodeStream(req, res, next) {
    try {
      const { episodeId } = req.params;
      const { quality } = req.query;
      await animeService.streamEpisode(res, episodeId, quality);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnimeController();
