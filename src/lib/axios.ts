import axios from 'axios';

// Detecta automaticamente a URL base da API baseada no ambiente
const getApiBaseUrl = () => {
  // Se estiver rodando localmente (localhost ou 127.0.0.1)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Se estiver rodando no servidor com Nginx proxy, usa URL relativa
  return '/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    // Se a resposta contiver dados, retorna os dados
    if (response.data?.data) {
      return response;
    }
    // Se não houver dados, retorna a resposta completa
    return response;
  },
  (error) => {
    // Se houver erro de validação
    if (error.response?.data?.errors) {
      const validationErrors = error.response.data.errors
        .map((err: any) => err.msg)
        .join(', ');
      return Promise.reject(new Error(validationErrors));
    }

    // Se houver mensagem de erro personalizada
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.error));
    }

    // Para outros erros
    return Promise.reject(new Error('Ocorreu um erro ao processar sua requisição.'));
  }
);