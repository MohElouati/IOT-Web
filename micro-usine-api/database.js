const Database = require('better-sqlite3');
const db = new Database('micro-usine.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS heartbeat (
    id INTEGER PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS api_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT NOT NULL,
    route TEXT NOT NULL,
    response_time INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS session_swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    direction TEXT NOT NULL,
    video_id TEXT,
    video_title TEXT,
    category_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )
`);

console.log('Base de données connectée : micro-usine.db');

function insertLog(action) {
  db.prepare('INSERT INTO logs (action) VALUES (?)').run(action);
}

function getLogs() {
  return db.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100').all();
}

function updateHeartbeat() {
  db.prepare('DELETE FROM heartbeat').run();
  db.prepare('INSERT INTO heartbeat (id) VALUES (1)').run();
}

function getLastHeartbeat() {
  return db.prepare('SELECT * FROM heartbeat WHERE id = 1').get();
}

function insertApiRequest(method, route, responseTime) {
  db.prepare('INSERT INTO api_requests (method, route, response_time) VALUES (?, ?, ?)').run(method, route, responseTime);
}

function getApiStats() {
  return {
    total: db.prepare('SELECT COUNT(*) as count FROM api_requests').get().count,
    by_route: db.prepare('SELECT route, method, COUNT(*) as count, AVG(response_time) as avg_time FROM api_requests GROUP BY route, method ORDER BY count DESC').all(),
    last_request: db.prepare('SELECT * FROM api_requests ORDER BY timestamp DESC LIMIT 1').get()
  }
}

function getTop5Routes() {
  return db.prepare('SELECT route, method, COUNT(*) as count FROM api_requests GROUP BY route, method ORDER BY count DESC LIMIT 5').all();
}

function startSession(platform) {
  const result = db.prepare('INSERT INTO sessions (platform) VALUES (?)').run(platform);
  return result.lastInsertRowid;
}

function stopSession(sessionId) {
  db.prepare('UPDATE sessions SET status = ?, ended_at = CURRENT_TIMESTAMP WHERE id = ?').run('ended', sessionId);
}

function getActiveSession() {
  return db.prepare('SELECT * FROM sessions WHERE status = ? ORDER BY started_at DESC LIMIT 1').get('active');
}

function insertSessionSwipe(sessionId, direction, videoId, videoTitle, categoryId) {
  db.prepare('INSERT INTO session_swipes (session_id, direction, video_id, video_title, category_id) VALUES (?, ?, ?, ?, ?)').run(sessionId, direction, videoId || null, videoTitle || null, categoryId || null);
}

function getSessionStats() {
  return db.prepare(`
    SELECT s.id, s.platform, s.started_at, s.ended_at,
    COUNT(sw.id) as total_swipes,
    SUM(CASE WHEN sw.direction = 'up' THEN 1 ELSE 0 END) as swipe_up,
    SUM(CASE WHEN sw.direction = 'down' THEN 1 ELSE 0 END) as swipe_down
    FROM sessions s
    LEFT JOIN session_swipes sw ON s.id = sw.session_id
    GROUP BY s.id
    ORDER BY s.started_at DESC
  `).all();
}

function getSwipesByCategory() {
  return db.prepare(`
    SELECT category_id, direction, COUNT(*) as count
    FROM session_swipes
    WHERE category_id IS NOT NULL
    GROUP BY category_id, direction
    ORDER BY count DESC
  `).all();
}

function getSwipesBySession(sessionId) {
  return db.prepare(`
    SELECT category_id, COUNT(*) as count
    FROM session_swipes
    WHERE session_id = ? AND category_id IS NOT NULL
    GROUP BY category_id
    ORDER BY count DESC
  `).all(sessionId);
}

function deleteSession(sessionId) {
  db.prepare('DELETE FROM session_swipes WHERE session_id = ?').run(sessionId);
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

module.exports = {
  insertLog, getLogs, updateHeartbeat, getLastHeartbeat,
  insertApiRequest, getApiStats, getTop5Routes,
  startSession, stopSession, getActiveSession,
  insertSessionSwipe, getSessionStats, getSwipesByCategory,
  getSwipesBySession, deleteSession
};