const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Micro-Usine API',
      version: '1.0.0',
      description: 'API de contrôle de la micro-usine tactile',
    },
    servers: [{ url: '/' }],
    tags: [
      { name: 'Auth',       description: 'Authentification OAuth2 Google' },
      { name: 'Robot',      description: 'Contrôle direct du système robotisé (OT)' },
      { name: 'Sessions',   description: 'Cycle de vie des sessions de scroll automatisé' },
      { name: 'Monitoring', description: 'Logs, statistiques API, observabilité' },
      { name: 'System',     description: 'Santé des composants (MQTT, connectivité, YouTube)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);