const cors = require('cors');

/**
 * Configuração do CORS para permitir requisições do frontend
 * @param {Object} options - Opções de configuração do CORS
 * @returns {Function} Middleware do CORS configurado
 */
const setupCors = (options = {}) => {
  const defaultOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
  };

  return cors({
    ...defaultOptions,
    ...options
  });
};

module.exports = setupCors;