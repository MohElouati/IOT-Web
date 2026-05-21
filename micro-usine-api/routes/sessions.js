const express = require('express');
const router = express.Router();
const { startSession, stopSession, getActiveSession, insertSessionSwipe, getSessionStats, insertLog, getSwipesByCategory, getSwipesBySession, deleteSession } = require('../database');
const { youtube } = require('@googleapis/youtube');

const PLAYLIST_ID = 'PL3Y5di2wCi82kkJapIquBHjlTmXHfNhhB';

let playlistVideos = [];
let currentVideoIndex = 0;

async function loadPlaylist() {
  if (!global.oauth2Client) return;
  try {
    const ytAuth = youtube({ version: 'v3', auth: global.oauth2Client });
    const response = await ytAuth.playlistItems.list({
      part: ['snippet'],
      playlistId: PLAYLIST_ID,
      maxResults: 50
    });
    const videos = await Promise.all(
      response.data.items.map(async (item) => {
        const videoId = item.snippet.resourceId.videoId;
        const videoRes = await ytAuth.videos.list({ part: ['snippet'], id: [videoId] });
        const video = videoRes.data.items[0];
        return {
          id: videoId,
          title: video.snippet.title,
          category_id: video.snippet.categoryId,
          channel: video.snippet.channelTitle,
          position: item.snippet.position
        };
      })
    );
    playlistVideos = videos;
    currentVideoIndex = 0;
    console.log(`Playlist chargée : ${videos.length} vidéos`);
  } catch (err) {
    console.error('Erreur chargement playlist:', err.message);
  }
}

/**
 * @swagger
 * /sessions/start:
 *   post:
 *     tags: [Sessions]
 *     summary: Démarrer une session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *                 example: youtube
 *     responses:
 *       200:
 *         description: Session démarrée
 */
router.post('/start', async (req, res) => {
  const { platform } = req.body;
  const sessionId = startSession(platform);
  insertLog(`session_start_${platform}`);

  if (platform === 'youtube') {
    await loadPlaylist();
  }

  res.json({ 
    status: 'ok', 
    session_id: sessionId, 
    platform,
    playlist_loaded: playlistVideos.length > 0,
    total_videos: playlistVideos.length
  });
});

/**
 * @swagger
 * /sessions/stop:
 *   post:
 *     tags: [Sessions]
 *     summary: Arrêter la session active
 *     responses:
 *       200:
 *         description: Session arrêtée
 */
router.post('/stop', (req, res) => {
  const session = getActiveSession();
  if (!session) return res.json({ status: 'no_active_session' });
  stopSession(session.id);
  insertLog(`session_stop_${session.platform}`);
  playlistVideos = [];
  currentVideoIndex = 0;
  res.json({ status: 'ok', session_id: session.id });
});

/**
 * @swagger
 * /sessions/active:
 *   get:
 *     tags: [Sessions]
 *     summary: Session active
 *     responses:
 *       200:
 *         description: Session en cours
 */
router.get('/active', (req, res) => {
  const session = getActiveSession();
  res.json(session || { status: 'no_active_session' });
});

/**
 * @swagger
 * /sessions/swipe:
 *   post:
 *     tags: [Sessions]
 *     summary: Enregistrer un swipe automatique depuis la playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               direction:
 *                 type: string
 *                 example: up
 *     responses:
 *       200:
 *         description: Swipe enregistré
 */
router.post('/swipe', async (req, res) => {
  const { direction } = req.body;
  const session = getActiveSession();
  if (!session) return res.json({ status: 'no_active_session' });

  let videoId = null;
  let videoTitle = null;
  let categoryId = null;

  if (playlistVideos.length > 0) {
    const currentVideo = playlistVideos[currentVideoIndex % playlistVideos.length];
    videoId = currentVideo.id;
    videoTitle = currentVideo.title;
    categoryId = currentVideo.category_id;
    currentVideoIndex++;
  }

  insertSessionSwipe(session.id, direction, videoId, videoTitle, categoryId);
  insertLog(`swipe_${direction}`);

  res.json({ 
    status: 'ok', 
    session_id: session.id, 
    direction, 
    video_title: videoTitle, 
    category_id: categoryId,
    video_index: currentVideoIndex
  });
});

/**
 * @swagger
 * /sessions/stats:
 *   get:
 *     tags: [Sessions]
 *     summary: Statistiques des sessions
 *     responses:
 *       200:
 *         description: Stats sessions
 */
router.get('/stats', (req, res) => {
  res.json(getSessionStats());
});

/**
 * @swagger
 * /sessions/categories:
 *   get:
 *     tags: [Sessions]
 *     summary: Swipes par catégorie YouTube
 *     responses:
 *       200:
 *         description: Catégories
 */
router.get('/categories', (req, res) => {
  res.json(getSwipesByCategory());
});

/**
 * @swagger
 * /sessions/{id}/swipes:
 *   get:
 *     tags: [Sessions]
 *     summary: Swipes d'une session par catégorie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Swipes par catégorie pour cette session
 */
router.get('/:id/swipes', (req, res) => {
  res.json(getSwipesBySession(req.params.id));
});

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     tags: [Sessions]
 *     summary: Supprimer une session
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Session supprimée
 */
router.delete('/:id', (req, res) => {
  deleteSession(req.params.id);
  res.json({ status: 'ok' });
});

module.exports = router;