# Beer Recommendation API

API para recomendação de estilos de cerveja baseada na temperatura e integração com playlists do Spotify.

## Requisitos

- Docker e Docker Compose
- Conta no Spotify Developer (para obter as credenciais da API)

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
Edite o arquivo `.env` com suas credenciais do Spotify:
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

### POST /api/recommendation

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
  "beerStyle": "Weissbier",
  "playlist": {
    "name": "Biela Bier BigTrail - A Weissbier da Cervejaria Biela Bier",
    "tracks": [
      {
        "name": "Learning To Fly",
        "artist": "Tom Petty and the Heartbreakers",
        "link": "https://open.spotify.com/track/51wdQRRr6ixzGQlE5l9Zwb"
      },
      {
        "name": "Simple Life",
        "artist": "Lynyrd Skynyrd",
        "link": "https://open.spotify.com/track/7aBClm8lSq91Ji8hQgIcQY"
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