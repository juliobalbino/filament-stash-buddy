const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const colors = require('colors');
const path = require('path');
require('dotenv').config();

// Importar configurações baseadas no ambiente
const { getConfig } = require('./config/config');

// Importar middlewares
const setupCors = require('./middleware/cors.middleware');
const errorHandler = require('./middleware/error.middleware');
const setupSwagger = require('./middleware/swagger.middleware');

// Importar conexão com o banco de dados
const { connectDB } = require('./config/database');

// Importar rotas
const filamentRoutes = require('./routes/filament.routes');

// Inicializar o Express
const app = express();

// Conectar ao banco de dados
connectDB();

// Obter configurações para o ambiente atual
const config = getConfig();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(setupCors(config.cors)); // Passar configurações de CORS
app.use(helmet(config.security?.helmet)); // Segurança para cabeçalhos HTTP com configurações específicas
app.use(morgan(config.logging?.morgan?.format || 'dev', config.logging?.morgan?.options)); // Logging de requisições

// Configurar Swagger UI para documentação da API
setupSwagger(app);

// Definir rotas
app.use('/api/filaments', filamentRoutes);

// Rota para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API do Filament Stash Buddy está funcionando!',
    version: '1.0.0'
  });
});

// Middleware para tratar rotas não encontradas
app.use((req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando no modo ${process.env.NODE_ENV} na porta ${PORT}`.yellow.bold);
});

// Lidar com rejeições de promessas não tratadas
process.on('unhandledRejection', (err) => {
  console.error(`Erro: ${err.message}`.red);
  // Fechar o servidor e sair do processo
  server.close(() => process.exit(1));
});

module.exports = app; // Para testes