# Filament Stash Buddy

## Descrição

O Filament Stash Buddy é uma aplicação web para gerenciamento de estoque de filamentos de impressão 3D. Ele permite que você controle seu inventário de filamentos, registrando informações como marca, material, cor, quantidade e pesos.

## Tecnologias Utilizadas

### Frontend
- React 18 com TypeScript
- Vite como bundler
- Tailwind CSS para estilização
- shadcn/ui para componentes de interface
- React Query para gerenciamento de estado e cache
- Axios para requisições HTTP
- React Router para navegação

### Backend
- Node.js com Express
- MongoDB com Mongoose
- Swagger para documentação da API
- CORS para segurança
- Helmet para proteção de cabeçalhos HTTP
- Morgan para logging

## Funcionalidades

- Cadastro e gerenciamento de filamentos
- Controle de estoque com atualização de quantidade
- Suporte a diferentes marcas e materiais
- Cálculo automático de pesos (carretel, filamento, total)
- Interface responsiva e intuitiva
- Importação e exportação de dados via CSV
- Validações de dados e feedback visual
- Tratamento de erros robusto

## Requisitos

- Node.js >= 18.0.0
- MongoDB
- Docker (opcional)

## Instalação e Execução

### Usando Docker

```bash
# Clone o repositório
git clone <URL_DO_REPOSITÓRIO>
cd filament-stash-buddy

# Configure o arquivo .env do servidor
cp server/.env.example server/.env
# Ajuste as variáveis no arquivo server/.env conforme necessário

# Inicie os containers
docker-compose up --build
```

A aplicação estará disponível em:
- Frontend: http://localhost
- API: http://localhost:5000

### Instalação Local

```bash
# Clone o repositório
git clone <URL_DO_REPOSITÓRIO>
cd filament-stash-buddy

# Instale as dependências do frontend
npm install

# Configure as variáveis de ambiente do frontend
cp .env.example .env

# Inicie o frontend em modo de desenvolvimento
npm run dev

# Em outro terminal, configure o backend
cd server

# Instale as dependências do backend
npm install

# Configure as variáveis de ambiente do backend
cp .env.example .env

# Inicie o backend em modo de desenvolvimento
npm run dev
```

## Documentação

- A documentação da API está disponível em `/api-docs` quando o servidor está em execução
- Collection do Postman disponível em `server/docs/filament-stash-buddy.postman_collection.json`

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
