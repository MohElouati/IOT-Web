const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const { getLastHeartbeat } = require('../database');

const client = mqtt.connect('mqtt://192.168.1.15:1883');

let brokerData = {
  clients_connected: 0,
  uptime: '0',
  messages_received: 0,
}

client.on('connect', () => {
  client.subscribe('$SYS/broker/clients/connected')
  client.subscribe('$SYS/broker/uptime')
  client.subscribe('$SYS/broker/messages/received')
})

client.on('message', (topic, message) => {
  const val = message.toString()
  if (topic === '$SYS/broker/clients/connected') brokerData.clients_connected = parseInt(val)
  if (topic === '$SYS/broker/uptime') brokerData.uptime = val
  if (topic === '$SYS/broker/messages/received') brokerData.messages_received = parseInt(val)
})

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
    broker: '192.168.1.15',
    esp32: esp32Connected
  });
})

module.exports = router;