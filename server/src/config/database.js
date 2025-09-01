const mongoose = require('mongoose');
require('dotenv').config();

// Opções de configuração para a conexão com o MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// URL de conexão com o MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/filaments';

// Função para conectar ao MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Eventos de conexão do MongoDB
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Erro na conexão do Mongoose: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado do MongoDB');
});

// Encerrar a conexão quando o processo Node terminar
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexão do Mongoose encerrada devido ao encerramento do aplicativo');
  process.exit(0);
});

module.exports = { connectDB };