# Beer Recommendation API

API para recomendação de estilos de cerveja baseada na temperatura e integração com playlists do Spotify.

## Requisitos

- [Docker e Docker Compose](https://docs.docker.com/get-started/get-docker/)
- Conta no Spotify Developer (para [obter as credenciais da API](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app)

## Instalação e Execução

1. Clone o repositório:
```bash
git clone git@github.com:rwmsousa/teste-karhub.git
cd teste-karkub
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas [credenciais do Spotify](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app):
- `SPOTIFY_CLIENT_ID`: Seu Client ID do Spotify
- `SPOTIFY_CLIENT_SECRET`: Seu Client Secret do Spotify

3. Inicie os containers:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. Aguarde a inicialização completa do banco de dados (o serviço db tem um healthcheck que garante que o banco está pronto)

5. Execute o seed do banco de dados:
```bash
docker-compose -f docker-compose.dev.yml exec api yarn seed
```

A API estará disponível em `http://localhost:3001`

## Documentação da API

A documentação completa da API está disponível através do Swagger UI em:

```
http://localhost:3001/api-docs
```

### Como usar o Swagger

1. Acesse a URL `http://localhost:3001/api-docs`
2. Você verá uma interface interativa com todos os endpoints disponíveis
3. Clique em qualquer endpoint para expandir e ver os detalhes
4. Para testar um endpoint:
   - Clique no botão "Try it out"
   - Preencha os parâmetros necessários (se houver)
   - Clique em "Execute"
   - Veja a resposta do servidor

### Endpoints disponíveis

- `GET /api/beer-styles`: Lista todos os estilos de cerveja
- `GET /api/beer-styles/:id`: Obtém um estilo de cerveja específico
- `POST /api/beer-styles`: Cria um novo estilo de cerveja
- `PUT /api/beer-styles/:id`: Atualiza um estilo de cerveja existente
- `DELETE /api/beer-styles/:id`: Remove um estilo de cerveja
- `POST /api/recommendation`: Obtém recomendações de cerveja baseadas na temperatura

## Estrutura do Projeto

```
src/
├── config/          # Configurações do projeto
├── controllers/     # Controladores da API
├── database/        # Configurações e seeds do banco de dados
├── entities/        # Entidades do TypeORM
├── routes/          # Rotas da API
├── services/        # Serviços da aplicação
└── app.ts           # Arquivo principal da aplicação
```

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Swagger UI
- Docker
- Docker Compose

## Licença

MIT 