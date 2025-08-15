'use strict';

const { randomUUID } = require('crypto');

// PUBLIC_INTERFACE
/**
 * InteractionsService stores comments, likes, and tracking progress in memory.
 * This is a simple in-memory implementation for demo/dev purposes.
 * For production, replace with a persistent database.
 */
class InteractionsService {
  constructor() {
    this.comments = []; // {id, animeId, episodeId?, userId, content, createdAt}
    this.likes = new Map(); // animeId -> Set<userId>
    this.tracking = new Map(); // key(userId:animeId:episodeId) -> {userId, animeId, episodeId, progressSeconds, updatedAt}
  }

  // PUBLIC_INTERFACE
  addComment({ animeId, episodeId, userId, content }) {
    if (!animeId || !userId || !content) {
      const err = new Error('animeId, userId and content are required');
      err.status = 400;
      throw err;
    }
    const comment = {
      id: randomUUID(),
      animeId,
      episodeId: episodeId || null,
      userId,
      content,
      createdAt: new Date().toISOString()
    };
    this.comments.push(comment);
    return comment;
  }

  // PUBLIC_INTERFACE
  getComments({ animeId, episodeId }) {
    return this.comments.filter((c) => {
      const animeMatch = animeId ? c.animeId === animeId : true;
      const epMatch =
        typeof episodeId !== 'undefined' && episodeId !== null && episodeId !== ''
          ? c.episodeId === episodeId
          : true;
      return animeMatch && epMatch;
    });
  }

  // PUBLIC_INTERFACE
  setLike({ animeId, userId, like }) {
    if (!animeId || !userId || typeof like !== 'boolean') {
      const err = new Error('animeId, userId and like(boolean) are required');
      err.status = 400;
      throw err;
    }
    const set = this.likes.get(animeId) || new Set();
    if (like) {
      set.add(userId);
    } else {
      set.delete(userId);
    }
    this.likes.set(animeId, set);
    return { animeId, userId, liked: like, count: set.size };
  }

  // PUBLIC_INTERFACE
  getLikes({ animeId, userId }) {
    if (!animeId) {
      const err = new Error('animeId is required');
      err.status = 400;
      throw err;
    }
    const set = this.likes.get(animeId) || new Set();
    const result = { animeId, count: set.size };
    if (userId) {
      result.liked = set.has(userId);
    }
    return result;
  }

  // PUBLIC_INTERFACE
  setProgress({ animeId, episodeId, userId, progressSeconds }) {
    if (!animeId || !episodeId || !userId || typeof progressSeconds !== 'number') {
      const err = new Error('animeId, episodeId, userId, and progressSeconds(number) are required');
      err.status = 400;
      throw err;
    }
    const key = `${userId}:${animeId}:${episodeId}`;
    const record = {
      userId,
      animeId,
      episodeId,
      progressSeconds,
      updatedAt: new Date().toISOString()
    };
    this.tracking.set(key, record);
    return record;
  }

  // PUBLIC_INTERFACE
  getProgress({ animeId, userId, episodeId }) {
    if (!animeId || !userId) {
      const err = new Error('animeId and userId are required');
      err.status = 400;
      throw err;
    }
    if (episodeId) {
      const key = `${userId}:${animeId}:${episodeId}`;
      return this.tracking.get(key) || null;
    }
    // return all episodes progress for this anime/user
    const prefix = `${userId}:${animeId}:`;
    const items = [];
    for (const [k, v] of this.tracking.entries()) {
      if (k.startsWith(prefix)) items.push(v);
    }
    return items;
  }
}

module.exports = new InteractionsService();
