const express = require('express');
const router = express.Router();
const client = require('../mqttClient');
const { getLastHeartbeat } = require('../database');

let brokerData = {
  clients_connected: 0,
  uptime: '0',
  messages_received: 0,
}

// AWS IoT Core has no $SYS broker-stats topics (Mosquitto-specific) and
// forcibly disconnects clients that attempt an unauthorized subscribe, so
// brokerData just stays at its zero defaults - no subscription to make.

/**
 * @swagger
 * /system-health/broker:
 *   get:
 *     tags: [System]
 *     summary: Santé du broker MQTT
 *     responses:
 *       200:
 *         description: Données broker
 */
router.get('/broker', (req, res) => {
  res.json(brokerData)
})

/**
 * @swagger
 * /system-health/connectivity:
 *   get:
 *     tags: [System]
 *     summary: Connectivité des composants
 *     responses:
 *       200:
 *         description: État de la connectivité
 */
router.get('/connectivity', (req, res) => {
  const heartbeat = getLastHeartbeat();
  const esp32Connected = heartbeat &&
    (new Date() - new Date(heartbeat.timestamp)) < 10000;

  res.json({
    status: 'online',
    broker: process.env.AWS_IOT_ENDPOINT || 'a9qjfqylwh619-ats.iot.eu-west-3.amazonaws.com',
    esp32: esp32Connected
  });
})

module.exports = router;