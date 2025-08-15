const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anime Viewer Plus API',
      version: '0.1.0',
      description: 'Express API for browsing anime, fetching episodes, streaming via free sources, and user interactions (comments, likes, tracking).',
    },
    tags: [
      { name: 'Health', description: 'Service health and status' },
      { name: 'Anime', description: 'Anime catalog, info, episodes, and streams' },
      { name: 'Interactions', description: 'Comments, likes, and episode tracking' }
    ]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
