const { insertApiRequest } = require('../database');

function requestLogger(req, res, next) {
  const start = Date.now();
  const route = req.originalUrl;
  const method = req.method;

  if (route.startsWith('/api-docs')) {
    return next();
  }

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    insertApiRequest(method, route, responseTime);
  });

  next();
}

module.exports = requestLogger;