/**
 * Middleware para tratamento de erros
 * @param {Error} err - O erro capturado
 * @param {Request} req - O objeto de requisição Express
 * @param {Response} res - O objeto de resposta Express
 * @param {NextFunction} next - A função next do Express
 */
const errorHandler = (err, req, res, next) => {
  console.error(`Erro: ${err.message}`.red);
  console.error(err.stack);

  // Erro padrão
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Erro no servidor';

  // Verificar erros específicos do Mongoose
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'ID inválido';
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Erro de duplicação (código 11000 do MongoDB)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Valor duplicado para o campo ${Object.keys(err.keyValue).join(', ')}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;