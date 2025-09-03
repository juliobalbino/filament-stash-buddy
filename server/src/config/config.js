/**
 * Configurações centralizadas da aplicação
 * Carrega configurações específicas com base no ambiente (development, production, test)
 */

const developmentConfig = {
  // Configurações padrão para ambiente de desenvolvimento
  security: {
    helmet: {
      contentSecurityPolicy: false, // Desativado em desenvolvimento para facilitar o debug
    },
  },
  logging: {
    morgan: {
      format: 'dev', // Formato simplificado para desenvolvimento
      options: {},
    },
  },
  cors: {
    origin: '*', // Permite acesso de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};

// Importar configurações específicas para produção
const productionConfig = require('./production');

// Configurações para ambiente de teste
const testConfig = {
  // Configurações específicas para testes
  database: {
    mongoOptions: {
      maxPoolSize: 10,
    },
  },
  logging: {
    morgan: {
      format: 'tiny', // Formato mínimo para testes
      options: {},
    },
  },
};

/**
 * Seleciona a configuração com base no ambiente atual
 * @returns {Object} Configuração para o ambiente atual
 */
const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

module.exports = {
  getConfig,
  // Exportar configurações específicas para uso direto se necessário
  development: developmentConfig,
  production: productionConfig,
  test: testConfig,
};