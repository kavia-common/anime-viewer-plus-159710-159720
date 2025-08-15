const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

// CORS policy
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Helper to build dynamic OpenAPI servers based on current request
function buildDynamicSpec(req) {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol;  // http or https
  const actualPort = req.socket.localPort;
  const hasPort = host && host.includes(':');

  const needsPort =
    host &&
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));

  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  return {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
}

// Swagger UI
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const dynamicSpec = buildDynamicSpec(req);
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// OpenAPI JSON for programmatic access
app.get('/openapi.json', (req, res) => {
  const dynamicSpec = buildDynamicSpec(req);
  res.json(dynamicSpec);
});

// Parse JSON request body
app.use(express.json());

// Mount routes at root (routes include /api prefix)
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
