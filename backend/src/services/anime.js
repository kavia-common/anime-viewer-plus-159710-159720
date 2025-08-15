'use strict';

const axios = require('axios');

// PUBLIC_INTERFACE
/**
 * AnimeService interacts with a free anime API (Consumet Gogoanime).
 * It supports searching, browsing, fetching info, episode sources, and proxy streaming.
 *
 * Configuration:
 * - ANIME_API_BASE: Optional override for the Consumet base URL.
 */
class AnimeService {
  constructor() {
    this.baseUrl =
      process.env.ANIME_API_BASE || 'https://api.consumet.org/anime/gogoanime';
    this.http = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000,
      headers: { 'User-Agent': 'AnimeViewerPlus/0.1' }
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Search anime by query with pagination.
   * @param {string} query
   * @param {number} page
   * @returns {Promise<object>}
   */
  async search(query, page = 1) {
    if (!query || typeof query !== 'string') {
      throw Object.assign(new Error('Query parameter "q" is required'), { status: 400 });
    }
    const { data } = await this.http.get(`/${encodeURIComponent(query)}`, {
      params: { page }
    });
    return data;
  }

  // PUBLIC_INTERFACE
  /**
   * Get top airing/trending anime.
   * @param {number} page
   * @returns {Promise<object>}
   */
  async trending(page = 1) {
    const { data } = await this.http.get('/top-airing', { params: { page } });
    return data;
  }

  // PUBLIC_INTERFACE
  /**
   * Get recent episodes feed.
   * @param {number} page
   * @param {number} type 1=sub, 2=dub
   * @returns {Promise<object>}
   */
  async recent(page = 1, type = 1) {
    const { data } = await this.http.get('/recent-episodes', {
      params: { page, type }
    });
    return data;
  }

  // PUBLIC_INTERFACE
  /**
   * Get anime info by id (includes episodes).
   * @param {string} animeId
   * @returns {Promise<object>}
   */
  async info(animeId) {
    if (!animeId) {
      throw Object.assign(new Error('animeId is required'), { status: 400 });
    }
    const { data } = await this.http.get(`/info/${encodeURIComponent(animeId)}`);
    return data;
  }

  // PUBLIC_INTERFACE
  /**
   * Get episode streaming sources and headers from Consumet.
   * @param {string} episodeId
   * @returns {Promise<object>} { sources: [{url, quality, isM3U8}], headers: {referer?: string} }
   */
  async episodeSources(episodeId) {
    if (!episodeId) {
      throw Object.assign(new Error('episodeId is required'), { status: 400 });
    }
    const { data } = await this.http.get(`/watch/${encodeURIComponent(episodeId)}`);
    return data;
  }

  // PUBLIC_INTERFACE
  /**
   * Select a source URL for an episode by desired quality, fallback to best available.
   * @param {string} episodeId
   * @param {string|number} quality e.g., '720p' or 720
   * @returns {Promise<{url: string, headers: object, isM3U8: boolean}>}
   */
  async selectEpisodeSource(episodeId, quality) {
    const data = await this.episodeSources(episodeId);
    const sources = Array.isArray(data?.sources) ? data.sources : [];
    if (sources.length === 0) {
      throw Object.assign(new Error('No sources available for episode'), { status: 404 });
    }
    const normalize = (q) => (typeof q === 'string' ? q.replace('p', '') : String(q));
    const desired = quality ? normalize(quality) : null;
    let selected = sources[0];
    if (desired) {
      const exact = sources.find((s) => normalize(s.quality) === desired);
      if (exact) selected = exact;
    }
    // Prefer m3u8 if qualities are same
    if (!desired) {
      const m3u8 = sources.find((s) => s.isM3U8);
      if (m3u8) selected = m3u8;
    }
    return {
      url: selected.url,
      headers: data?.headers || {},
      isM3U8: !!selected.isM3U8
    };
  }

  // PUBLIC_INTERFACE
  /**
   * Stream proxy for an episode. Pipes upstream response into Express res.
   * Note: Simple proxy without advanced range support. Suitable for HLS (m3u8).
   * @param {object} res Express response
   * @param {string} episodeId
   * @param {string|number} quality
   */
  async streamEpisode(res, episodeId, quality) {
    const { url, headers, isM3U8 } = await this.selectEpisodeSource(episodeId, quality);
    const upstreamHeaders = {
      ...(headers || {}),
      // Helpful defaults:
      'User-Agent': 'AnimeViewerPlus/0.1',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
    };
    const upstream = await axios.get(url, {
      responseType: 'stream',
      headers: upstreamHeaders,
      // Larger timeout for streaming
      timeout: 60000,
      validateStatus: () => true
    });

    if (upstream.status >= 400) {
      throw Object.assign(new Error(`Upstream stream failed with status ${upstream.status}`), {
        status: 502
      });
    }

    // Set basic content type
    if (isM3U8 || url.includes('.m3u8')) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    } else if (url.includes('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else {
      res.setHeader('Content-Type', upstream.headers['content-type'] || 'application/octet-stream');
    }

    // Pipe upstream to client
    upstream.data.pipe(res);
  }
}

module.exports = new AnimeService();
