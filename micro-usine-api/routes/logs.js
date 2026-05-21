const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('micro-usine.db');

/**
 * @swagger
 * /logs:
 *   get:
 *     tags: [Monitoring]
 *     summary: Récupérer les logs
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [24h, 7d]
 *     responses:
 *       200:
 *         description: Liste des logs
 */
router.get('/', (req, res) => {
  const { period } = req.query
  const filter = period === '7d' ? "-7 days" : "-24 hours"
  const logs = db.prepare(`SELECT * FROM logs WHERE timestamp >= datetime('now', '${filter}') ORDER BY timestamp DESC LIMIT 500`).all()
  res.json(logs);
});

module.exports = router;