import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Beer Styles API',
      version: '1.0.0',
      description: 'API para gerenciamento de estilos de cerveja e recomendações',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento (Docker)',
      },
    ],
    components: {
      schemas: {
        BeerStyle: {
          type: 'object',
          required: ['name', 'description', 'minimumTemperature', 'maximumTemperature'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do estilo de cerveja',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              description: 'Nome do estilo de cerveja',
              example: 'Stout',
            },
            description: {
              type: 'string',
              description: 'Descrição do estilo de cerveja',
              example:
                'Cerveja escura e encorpada, com notas pronunciadas de café, chocolate e malte torrado. Apresenta espuma cremosa e persistente, com coloração marrom clara.',
            },
            minimumTemperature: {
              type: 'number',
              description: 'Temperatura mínima recomendada em graus Celsius',
              example: 6,
            },
            maximumTemperature: {
              type: 'number',
              description: 'Temperatura máxima recomendada em graus Celsius',
              example: 8,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização do registro',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Internal server error',
            },
          },
        },
      },
    },
    paths: {
      '/api/beer-styles': {
        get: {
          tags: ['Beer Styles'],
          summary: 'Lista todos os estilos de cerveja',
          responses: {
            '200': {
              description: 'Lista de estilos de cerveja',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/BeerStyle',
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Beer Styles'],
          summary: 'Cria um novo estilo de cerveja',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'description', 'minimumTemperature', 'maximumTemperature'],
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Porter',
                    },
                    description: {
                      type: 'string',
                      example:
                        'Cerveja escura inglesa, com sabores robustos de malte torrado, notas de chocolate amargo, café e caramelo. Apresenta corpo médio e espuma densa e cremosa.',
                    },
                    minimumTemperature: {
                      type: 'number',
                      example: 7,
                    },
                    maximumTemperature: {
                      type: 'number',
                      example: 10,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Estilo de cerveja criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/BeerStyle',
                  },
                },
              },
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/beer-styles/{id}': {
        get: {
          tags: ['Beer Styles'],
          summary: 'Obtém um estilo de cerveja pelo ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do estilo de cerveja',
              schema: {
                type: 'string',
                format: 'uuid',
              },
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          ],
          responses: {
            '200': {
              description: 'Estilo de cerveja encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/BeerStyle',
                  },
                },
              },
            },
            '404': {
              description: 'Estilo de cerveja não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['Beer Styles'],
          summary: 'Atualiza um estilo de cerveja',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do estilo de cerveja',
              schema: {
                type: 'string',
                format: 'uuid',
              },
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Stout',
                    },
                    description: {
                      type: 'string',
                      example:
                        'Cerveja escura e encorpada, com notas pronunciadas de café, chocolate e malte torrado. Apresenta espuma cremosa e persistente, com coloração marrom clara.',
                    },
                    minimumTemperature: {
                      type: 'number',
                      example: 6,
                    },
                    maximumTemperature: {
                      type: 'number',
                      example: 8,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Estilo de cerveja atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/BeerStyle',
                  },
                },
              },
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Estilo de cerveja não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Beer Styles'],
          summary: 'Remove um estilo de cerveja',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do estilo de cerveja',
              schema: {
                type: 'string',
                format: 'uuid',
              },
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          ],
          responses: {
            '204': {
              description: 'Estilo de cerveja removido com sucesso',
            },
            '404': {
              description: 'Estilo de cerveja não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/recommendation': {
        post: {
          tags: ['Beer Recommendation'],
          summary: 'Obtém uma recomendação de cerveja baseada na temperatura',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['temperature'],
                  properties: {
                    temperature: {
                      type: 'number',
                      description: 'Temperatura em graus Celsius',
                      example: 5,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Recomendação encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      beerStyle: {
                        type: 'string',
                        description: 'Nome do estilo de cerveja recomendado',
                        example: 'Stout',
                      },
                      playlist: {
                        type: 'object',
                        description: 'Informações da playlist recomendada',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'Nome da playlist',
                            example: 'Rock Classics',
                          },
                          tracks: {
                            type: 'array',
                            description: 'Lista de músicas',
                            items: {
                              type: 'string',
                            },
                            example: ['Track 1', 'Track 2', 'Track 3'],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Temperatura inválida',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Nenhum estilo de cerveja encontrado para a temperatura informada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
