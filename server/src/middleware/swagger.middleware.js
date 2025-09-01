const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

/**
 * Middleware para configurar o Swagger UI para documentação da API
 * @param {Express} app - Instância do aplicativo Express
 */
const setupSwagger = (app) => {
  try {
    // Carrega o arquivo YAML da documentação OpenAPI
    const swaggerDocument = YAML.load(
      path.join(__dirname, '../../docs/api-docs.yaml')
    );

    // Configura o middleware do Swagger UI
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Filament Stash Buddy API - Documentação',
        customfavIcon: '/favicon.ico'
      })
    );

    console.log('Swagger UI configurado com sucesso em /api-docs');
  } catch (error) {
    console.error('Erro ao configurar Swagger UI:', error.message);
  }
};

module.exports = setupSwagger;