const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');

function loadCredential(envVar, filename) {
  if (process.env[envVar]) return process.env[envVar];
  return fs.readFileSync(path.join(__dirname, 'certs', filename));
}

const endpoint = process.env.AWS_IOT_ENDPOINT || 'a9qjfqylwh619-ats.iot.eu-west-3.amazonaws.com';
const cert = loadCredential('AWS_IOT_CERT', 'mcu-backend.cert.pem');
const key = loadCredential('AWS_IOT_KEY', 'mcu-backend.private.key');
const ca = loadCredential('AWS_IOT_CA', 'AmazonRootCA1.pem');

const client = mqtt.connect({
  host: endpoint,
  port: 8883,
  protocol: 'mqtts',
  cert,
  key,
  ca,
  clientId: 'micro-usine-api',
  rejectUnauthorized: true
});

client.on('connect', () => console.log('AWS IoT Core connecté'));
client.on('reconnect', () => console.log('AWS IoT Core : reconnexion...'));
client.on('close', () => console.log('AWS IoT Core : connexion fermée'));
client.on('error', (err) => console.error('AWS IoT Core erreur MQTT :', err.message));

module.exports = client;
