const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const USERS = { admin: process.env.ADMIN_PASSWORD };

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback'
);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion admin (username/password)
 *     responses:
 *       200:
 *         description: Token JWT
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/token', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Identifiants incorrects' });
});

/**
 * @swagger
 * /auth/login:
 *   get:
 *     tags: [Auth]
 *     summary: Démarrer l'authentification Google (YouTube)
 *     responses:
 *       302:
 *         description: Redirection vers Google
 */
router.get('/login', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly']
  });
  res.redirect(url);
});

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Callback OAuth Google
 *     responses:
 *       200:
 *         description: Authentification réussie
 */
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Code manquant');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    global.oauth2Client = oauth2Client;
    res.send('Authentification YouTube réussie, vous pouvez fermer cette fenêtre.');
  } catch (err) {
    res.status(500).send("Erreur d'authentification: " + err.message);
  }
});

module.exports = { router };