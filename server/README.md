# Filament Stash Buddy API

API RESTful para gerenciamento de estoque de filamentos para impressão 3D.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Express Validator

## Requisitos

- Node.js >= 18.0.0
- MongoDB

## Instalação

1. Clone o repositório
2. Navegue até a pasta do servidor:
   ```
   cd server
   ```
3. Instale as dependências:
   ```
   npm install
   ```
4. Crie um arquivo `.env` baseado no `.env.example` e configure as variáveis de ambiente

## Executando o Servidor

### Desenvolvimento

```
npm run dev
```

### Produção

```
npm start
```

## Estrutura da API

### Endpoints

#### Filamentos

- `GET /api/filaments` - Listar todos os filamentos
- `GET /api/filaments/:id` - Obter um filamento específico
- `POST /api/filaments` - Criar um novo filamento
- `PUT /api/filaments/:id` - Atualizar um filamento
- `DELETE /api/filaments/:id` - Excluir um filamento
- `PATCH /api/filaments/:id/quantidade` - Atualizar apenas a quantidade
- `GET /api/filaments/stats` - Obter estatísticas de filamentos

### Filtros

A rota `GET /api/filaments` aceita os seguintes parâmetros de consulta para filtragem:

- `marca` - Filtrar por marca (pesquisa parcial, case insensitive)
- `material` - Filtrar por material (correspondência exata)
- `cor` - Filtrar por cor (pesquisa parcial, case insensitive)
- `quantidade` - Filtrar por quantidade mínima

Exemplo: `GET /api/filaments?material=PLA&quantidade=1`

## Modelo de Dados

### Filamento

```javascript
{
  marca: String,          // Obrigatório
  material: String,       // Obrigatório (PLA, PETG, ABS, etc.)
  cor: String,            // Obrigatório
  corRgb: String,         // Obrigatório (formato: #RRGGBB)
  quantidade: Number,     // Obrigatório (>= 0)
  pesoCarretel: Number,   // Opcional (>= 0)
  pesoFilamento: Number,  // Opcional (>= 0)
  pesoRolo: Number,       // Opcional (>= 0)
  dataCriacao: Date,      // Automático
  dataAtualizacao: Date   // Automático
}
```

## Licença

MIT