const express = require('express');
const router = express.Router();
const client = require('../mqttClient');
const { insertLog, updateHeartbeat } = require('../database');

client.on('connect', () => {
  console.log('MQTT connecté');
  client.subscribe('micro-usine/heartbeat');
});

client.on('message', (topic, message) => {
  if (topic === 'micro-usine/heartbeat') {
    updateHeartbeat();
  }
});

/**
 * @swagger
 * /scroll/up:
 *   post:
 *     tags: [Robot]
 *     summary: Swipe vers le haut
 *     responses:
 *       200:
 *         description: Commande envoyée
 */
router.post('/up', (req, res) => {
  client.publish('micro-usine/scroll', 'up');
  insertLog('swipe_up');
  res.json({ status: 'ok', action: 'swipe_up' });
});

/**
 * @swagger
 * /scroll/down:
 *   post:
 *     tags: [Robot]
 *     summary: Swipe vers le bas
 *     responses:
 *       200:
 *         description: Commande envoyée
 */
router.post('/down', (req, res) => {
  client.publish('micro-usine/scroll', 'down');
  insertLog('swipe_down');
  res.json({ status: 'ok', action: 'swipe_down' });
});

/**
 * @swagger
 * /scroll/emergency-stop:
 *   post:
 *     tags: [Robot]
 *     summary: Arrêt d'urgence du système robotisé
 *     responses:
 *       200:
 *         description: Arrêt d'urgence déclenché
 */
router.post('/emergency-stop', (req, res) => {
  client.publish('micro-usine/scroll', 'stop');
  insertLog('emergency_stop');
  res.json({ status: 'ok', action: 'emergency_stop' });
});

module.exports = router;