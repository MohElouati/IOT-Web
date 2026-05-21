const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('micro-usine.db');
const { getTop5Routes } = require('../database');

/**
 * @swagger
 * /api-stats:
 *   get:
 *     tags: [Monitoring]
 *     summary: Statistiques de l'API
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [24h, 7d]
 *     responses:
 *       200:
 *         description: Stats API
 */
router.get('/', (req, res) => {
  const { period } = req.query
  const filter = period === '7d' ? "-7 days" : "-24 hours"

  res.json({
    total: db.prepare(`SELECT COUNT(*) as count FROM api_requests WHERE timestamp >= datetime('now', '${filter}')`).get().count,
    by_route: db.prepare(`SELECT route, method, COUNT(*) as count, AVG(response_time) as avg_time FROM api_requests WHERE timestamp >= datetime('now', '${filter}') GROUP BY route, method ORDER BY count DESC`).all(),
    last_request: db.prepare("SELECT * FROM api_requests ORDER BY timestamp DESC LIMIT 1").get()
  })
});

/**
 * @swagger
 * /api-stats/top5:
 *   get:
 *     tags: [Monitoring]
 *     summary: Top 5 routes les plus utilisées
 *     responses:
 *       200:
 *         description: Top 5 routes
 */
router.get('/top5', (req, res) => {
  res.json(getTop5Routes());
});

module.exports = router;