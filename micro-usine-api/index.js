const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const requestLogger = require('./middleware/requestLogger');
const scrollRoutes = require('./routes/scroll');
const logsRoutes = require('./routes/logs');
const systemHealthRoutes = require('./routes/system-health');
const apiStatsRoutes = require('./routes/api-stats');
const sessionsRoutes = require('./routes/sessions');
const youtubeRoutes = require('./routes/youtube');
const { router: authRoutes } = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger); // ← ici avant toutes les routes

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/scroll', scrollRoutes);
app.use('/logs', logsRoutes);
app.use('/system-health', systemHealthRoutes);
app.use('/api-stats', apiStatsRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/youtube', youtubeRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
  console.log(`Swagger : http://localhost:${PORT}/api-docs`);
});