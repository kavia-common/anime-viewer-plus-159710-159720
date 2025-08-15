# anime-viewer-plus-159710-159720

Backend (Express) provides:

- Health: GET /
- OpenAPI JSON: GET /openapi.json
- Swagger UI: GET /docs

Anime endpoints (via free API - Consumet Gogoanime):
- GET /api/anime/search?q=naruto&page=1
- GET /api/anime/trending?page=1
- GET /api/anime/recent?page=1&type=1
- GET /api/anime/:id
- GET /api/anime/episode/:episodeId/sources
- GET /api/anime/episode/:episodeId/redirect
- GET /api/anime/episode/:episodeId/stream

Interactions (in-memory demo):
- GET /api/interactions/comments?animeId=&episodeId=
- POST /api/interactions/comments { animeId, episodeId?, userId?, content }
- GET /api/interactions/likes?animeId=&userId=
- POST /api/interactions/likes { animeId, userId?, like }
- GET /api/interactions/tracking?animeId=&userId=&episodeId=
- POST /api/interactions/tracking { animeId, episodeId, userId?, progressSeconds }

Notes:
- Streaming proxy is basic (suitable for HLS m3u8). For MP4 seeking, implement range requests in the future.
- Interactions are stored in-memory and reset on server restart. Replace with a persistent DB for production.