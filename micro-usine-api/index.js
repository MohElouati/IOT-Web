const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const requestLogger = require('./middleware/requestLogger');
const requireAuth = require('./middleware/requireAuth');
const scrollRoutes = require('./routes/scroll');
const logsRoutes = require('./routes/logs');
const systemHealthRoutes = require('./routes/system-health');
const apiStatsRoutes = require('./routes/api-stats');
const sessionsRoutes = require('./routes/sessions');
const youtubeRoutes = require('./routes/youtube');
const { router: authRoutes } = require('./routes/auth');

const ALLOWED_ORIGINS = [
  'https://mcu.azops.ovh',
  'https://iot-web-production-0d2e.up.railway.app',
  'http://localhost:5173'
];

const app = express();
app.set('trust proxy', true);
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());
app.use(requestLogger); // ← ici avant toutes les routes

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/scroll', requireAuth, scrollRoutes);
app.use('/logs', requireAuth, logsRoutes);
app.use('/system-health', requireAuth, systemHealthRoutes);
app.use('/api-stats', requireAuth, apiStatsRoutes);
app.use('/sessions', requireAuth, sessionsRoutes);
app.use('/youtube', requireAuth, youtubeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
  console.log(`Swagger : http://localhost:${PORT}/api-docs`);
});