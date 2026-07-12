const express = require('express');
const router = express.Router();
const { youtube } = require('@googleapis/youtube');

const client = youtube({
  version: 'v3',
  auth: 'AIzaSyAazoJ1zVQN4mIgM_YoWsaJq4n_Ka8OaBE'
});

const PLAYLIST_ID = 'PL3Y5di2wCi82kkJapIquBHjlTmXHfNhhB';

/**
 * @swagger
 * /youtube/video:
 *   get:
 *     tags: [System]
 *     summary: Récupérer les infos d'une vidéo YouTube
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Infos vidéo
 */
router.get('/video', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID vidéo manquant' });

  try {
    const response = await client.videos.list({
      part: ['snippet', 'statistics'],
      id: [id]
    });
    const video = response.data.items[0];
    if (!video) return res.status(404).json({ error: 'Vidéo introuvable' });

    res.json({
      id: video.id,
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      category_id: video.snippet.categoryId,
      tags: video.snippet.tags || [],
      views: video.statistics.viewCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /youtube/playlist:
 *   get:
 *     tags: [System]
 *     summary: Récupérer les vidéos de la playlist demo
 *     responses:
 *       200:
 *         description: Liste des vidéos
 */
router.get('/playlist', async (req, res) => {
  if (!global.oauth2Client) {
    return res.status(409).json({ error: 'YouTube non connecté - allez sur /auth/login' })
  }

  try {
    const ytAuth = youtube({ version: 'v3', auth: global.oauth2Client })

    const response = await ytAuth.playlistItems.list({
      part: ['snippet'],
      playlistId: PLAYLIST_ID,
      maxResults: 50
    });

    const videos = await Promise.all(
      response.data.items.map(async (item) => {
        const videoId = item.snippet.resourceId.videoId;
        const videoRes = await ytAuth.videos.list({
          part: ['snippet'],
          id: [videoId]
        });
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

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;