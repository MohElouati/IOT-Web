const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');

function loadCredential(envVar, filename) {
  // Env values are base64 (Railway's UI mangles raw multi-line PEM pastes)
  if (process.env[envVar]) return Buffer.from(process.env[envVar], 'base64');
  return fs.readFileSync(path.join(__dirname, 'certs', filename));
}

const endpoint = process.env.AWS_IOT_ENDPOINT || 'a9qjfqylwh619-ats.iot.eu-west-3.amazonaws.com';

let client;
try {
  const cert = loadCredential('AWS_IOT_CERT', 'mcu-backend.cert.pem');
  const key = loadCredential('AWS_IOT_KEY', 'mcu-backend.private.key');
  const ca = loadCredential('AWS_IOT_CA', 'AmazonRootCA1.pem');

  client = mqtt.connect({
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
} catch (err) {
  // Missing/invalid certs shouldn't take down the whole API - just disable MQTT.
  console.error('AWS IoT Core : certificats introuvables, MQTT désactivé -', err.message);
  client = new (require('events').EventEmitter)();
  client.publish = () => {};
  client.subscribe = () => {};
}

module.exports = client;
