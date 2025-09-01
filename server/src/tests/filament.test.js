const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Filament = require('../models/filament.model');

// Mock de dados para testes
const testFilament = {
  brand: 'TestBrand',
  material: 'PLA',
  color: 'TestColor',
  quantity: 800,
  initialWeight: 1000,
  spoolWeight: 200,
  diameter: 1.75,
  lowStockThreshold: 100,
  notes: 'Filamento para testes',
};

let filamentId;

// Configuração antes de todos os testes
beforeAll(async () => {
  // Limpar a coleção de filamentos antes dos testes
  await Filament.deleteMany({});
});

// Limpeza após todos os testes
afterAll(async () => {
  // Fechar a conexão com o MongoDB após os testes
  await mongoose.connection.close();
});

describe('Testes da API de Filamentos', () => {
  // Teste para criar um novo filamento
  describe('POST /api/filaments', () => {
    it('deve criar um novo filamento', async () => {
      const res = await request(app)
        .post('/api/filaments')
        .send(testFilament);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.brand).toEqual(testFilament.brand);
      expect(res.body.material).toEqual(testFilament.material);
      expect(res.body.color).toEqual(testFilament.color);

      // Salvar o ID para uso em outros testes
      filamentId = res.body._id;
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const res = await request(app)
        .post('/api/filaments')
        .send({
          // Faltando campos obrigatórios
          brand: 'TestBrand',
          color: 'TestColor',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // Teste para obter todos os filamentos
  describe('GET /api/filaments', () => {
    it('deve retornar todos os filamentos', async () => {
      const res = await request(app).get('/api/filaments');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('deve filtrar filamentos por material', async () => {
      const res = await request(app).get('/api/filaments?material=PLA');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      res.body.forEach(filament => {
        expect(filament.material).toEqual('PLA');
      });
    });

    it('deve filtrar filamentos por marca', async () => {
      const res = await request(app).get(`/api/filaments?brand=${testFilament.brand}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      res.body.forEach(filament => {
        expect(filament.brand).toEqual(testFilament.brand);
      });
    });
  });

  // Teste para obter um filamento específico
  describe('GET /api/filaments/:id', () => {
    it('deve retornar um filamento pelo ID', async () => {
      const res = await request(app).get(`/api/filaments/${filamentId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', filamentId);
      expect(res.body.brand).toEqual(testFilament.brand);
    });

    it('deve retornar erro 404 para ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/filaments/${fakeId}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  // Teste para atualizar um filamento
  describe('PUT /api/filaments/:id', () => {
    it('deve atualizar um filamento existente', async () => {
      const updatedData = {
        ...testFilament,
        color: 'NovaCorTeste',
        notes: 'Filamento atualizado para testes',
      };

      const res = await request(app)
        .put(`/api/filaments/${filamentId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', filamentId);
      expect(res.body.color).toEqual(updatedData.color);
      expect(res.body.notes).toEqual(updatedData.notes);
    });
  });

  // Teste para atualizar apenas a quantidade
  describe('PATCH /api/filaments/:id/quantity', () => {
    it('deve atualizar apenas a quantidade do filamento', async () => {
      const newQuantity = 500;

      const res = await request(app)
        .patch(`/api/filaments/${filamentId}/quantity`)
        .send({ quantity: newQuantity });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', filamentId);
      expect(res.body.quantity).toEqual(newQuantity);
    });
  });

  // Teste para obter estatísticas
  describe('GET /api/filaments/stats', () => {
    it('deve retornar estatísticas dos filamentos', async () => {
      const res = await request(app).get('/api/filaments/stats');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalFilaments');
      expect(res.body).toHaveProperty('totalWeight');
      expect(res.body).toHaveProperty('materialDistribution');
      expect(res.body).toHaveProperty('brandDistribution');
    });
  });

  // Teste para excluir um filamento
  describe('DELETE /api/filaments/:id', () => {
    it('deve excluir um filamento existente', async () => {
      const res = await request(app).delete(`/api/filaments/${filamentId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');

      // Verificar se o filamento foi realmente excluído
      const checkRes = await request(app).get(`/api/filaments/${filamentId}`);
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});