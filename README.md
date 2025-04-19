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

## Endpoints

### Estilos de Cerveja (Beer Styles)

#### GET /api/beer-styles
Lista todos os estilos de cerveja disponíveis.

#### GET /api/beer-styles/:id
Retorna um estilo de cerveja específico pelo ID.

#### POST /api/beer-styles
Cria um novo estilo de cerveja.

**Request:**
```json
{
  "name": "Nome do Estilo",
  "description": "Descrição do estilo",
  "minimumTemperature": 0,
  "maximumTemperature": 10
}
```

#### PUT /api/beer-styles/:id
Atualiza um estilo de cerveja existente.

**Request:**
```json
{
  "name": "Novo Nome",
  "description": "Nova Descrição",
  "minimumTemperature": 0,
  "maximumTemperature": 10
}
```

#### DELETE /api/beer-styles/:id
Remove um estilo de cerveja.

#### POST /api/beer-styles/seed
Carrega dados iniciais de estilos de cerveja no banco de dados.

### Recomendação

#### POST /api/recommendation
Recomenda um estilo de cerveja baseado na temperatura e retorna uma playlist do Spotify relacionada.

**Request:**
```json
{
  "temperature": -7
}
```

**Response:**
```json
{
  "beerStyle": {
    "name": "Nome do Estilo",
    "description": "Descrição do estilo",
    "minTemperature": 0,
    "maxTemperature": 10
  },
  "playlist": {
    "name": "Nome da Playlist",
    "tracks": [
      {
        "name": "Nome da Música",
        "artist": "Nome do Artista"
      }
    ]
  }
}
```

**Códigos de Status:**
- 200: Sucesso
- 400: Temperatura inválida
- 404: Nenhum estilo de cerveja encontrado ou nenhuma playlist encontrada
- 500: Erro interno do servidor

## Regras de Negócio

1. Todo estilo de cerveja tem uma temperatura mínima e máxima
2. O cálculo para selecionar o estilo de cerveja adequado é baseado na média das temperaturas mais próxima do input dado pela API
3. Caso o resultado seja mais de um estilo de cerveja, o estilo é retornado em ordem alfabética
4. Caso não tenha uma playlist que contenha o nome do estilo, retorna um HTTP Status 404

## Testes

Para executar os testes:
```bash
docker-compose -f docker-compose.dev.yml exec api yarn test
```

Para executar os testes com cobertura:
```bash
docker-compose -f docker-compose.dev.yml exec api yarn test:coverage
```

## Licença

ISC 