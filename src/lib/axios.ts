import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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