import { OpenApiSpec } from 'next-swagger-doc';

const withSwagger = {
  openapi: '3.0.3',
  info: {
    title: 'EMS-SCADA Energy Management API',
    version: '1.0.0',
    description: `
Enterprise-grade EMS-SCADA API for energy asset management and monitoring.

## Features
- Real-time energy asset monitoring
- Performance analytics and reporting
- Alert management and notifications
- Portfolio-wide metrics and insights
- Authentication and user management

## Base URL
\`http://localhost:3000/api\`

## Authentication
Most endpoints require authentication via NextAuth.js session cookies.
    `,
    contact: {
      name: 'EMS-SCADA Support',
      email: 'support@pacifico-energy.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and session management'
    },
    {
      name: 'Assets',
      description: 'Energy asset management and monitoring'
    },
    {
      name: 'Portfolio',
      description: 'Portfolio-wide metrics and analytics'
    },
    {
      name: 'Real-time',
      description: 'WebSocket connections for real-time data'
    }
  ],
  paths: {
    '/auth/session': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user session',
        description: 'Returns the current authenticated user session information',
        responses: {
          '200': {
            description: 'Current session information',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/UserSession' },
                    { type: 'null' }
                  ]
                },
                examples: {
                  authenticated: {
                    summary: 'Authenticated user',
                    value: {
                      user: {
                        username: 'operator',
                        role: 'operator'
                      },
                      expires: '2025-10-29T20:00:00.000Z'
                    }
                  },
                  unauthenticated: {
                    summary: 'No active session',
                    value: null
                  }
                }
              }
            }
          }
        }
      }
    },
    '/assets': {
      get: {
        tags: ['Assets'],
        summary: 'Get all energy assets',
        description: 'Retrieve all energy assets with their latest performance data and active alerts',
        responses: {
          '200': {
            description: 'List of energy assets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/AssetWithDetails' }
                },
                examples: {
                  success: {
                    summary: 'Successful response',
                    value: [
                      {
                        id: 'cmg430xg80001q8kgd2o4yzre',
                        name: 'Wind Farm Beta',
                        type: 'wind',
                        capacity: 75.2,
                        location: 'Texas Panhandle',
                        lat: 35.3733,
                        lng: -101.8313,
                        status: 'exporting',
                        createdAt: '2025-09-28T19:17:54.393Z',
                        updatedAt: '2025-09-28T19:17:54.393Z',
                        performances: [
                          {
                            id: 'cmg430xh4000rq8kgc2tuaw44',
                            assetId: 'cmg430xg80001q8kgd2o4yzre',
                            timestamp: '2025-09-28T19:17:54.424Z',
                            generation: 53.04,
                            availability: 91.82,
                            efficiency: 85.31
                          }
                        ],
                        alerts: []
                      }
                    ]
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Assets'],
        summary: 'Create new energy asset',
        description: 'Create a new energy asset in the system',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAssetRequest' },
              examples: {
                windFarm: {
                  summary: 'Wind farm asset',
                  value: {
                    name: 'Wind Farm Alpha',
                    type: 'wind',
                    capacity: 150.5,
                    location: 'Kansas Plains',
                    lat: 39.0473,
                    lng: -95.6890,
                    status: 'offline'
                  }
                },
                solarFarm: {
                  summary: 'Solar farm asset',
                  value: {
                    name: 'Solar Farm Delta',
                    type: 'solar',
                    capacity: 85.2,
                    location: 'Arizona Desert',
                    lat: 33.4484,
                    lng: -112.074,
                    status: 'exporting'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Asset created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Asset' }
              }
            }
          },
          '400': {
            description: 'Invalid input data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/assets/{id}': {
      get: {
        tags: ['Assets'],
        summary: 'Get specific energy asset',
        description: 'Retrieve detailed information about a specific energy asset including performance history',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Asset unique identifier',
            schema: {
              type: 'string',
              example: 'cmg430xg80001q8kgd2o4yzre'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Asset details with performance history',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AssetWithHistory' }
              }
            }
          },
          '404': {
            description: 'Asset not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                examples: {
                  notFound: {
                    summary: 'Asset not found',
                    value: { error: 'Asset not found' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Assets'],
        summary: 'Update energy asset',
        description: 'Update specific fields of an energy asset',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Asset unique identifier',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateAssetRequest' },
              examples: {
                updateStatus: {
                  summary: 'Update asset status',
                  value: {
                    status: 'offline'
                  }
                },
                updateCapacity: {
                  summary: 'Update capacity and location',
                  value: {
                    capacity: 200.5,
                    location: 'Updated Location, TX'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Asset updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Asset' }
              }
            }
          },
          '404': {
            description: 'Asset not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get portfolio overview',
        description: 'Retrieve comprehensive portfolio metrics including total capacity, generation, efficiency, and asset status distribution',
        responses: {
          '200': {
            description: 'Portfolio metrics and overview',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PortfolioOverview' },
                examples: {
                  success: {
                    summary: 'Portfolio overview',
                    value: {
                      portfolio: {
                        id: 'portfolio123',
                        name: 'Main Portfolio',
                        totalCapacity: 500.5,
                        currentGeneration: 245.8
                      },
                      totalCapacity: 500.5,
                      currentGeneration: 245.8,
                      efficiency: 89.2,
                      assetCount: 37,
                      statusCounts: {
                        exporting: 25,
                        curtailing: 5,
                        offline: 2,
                        charging: 5
                      },
                      lastUpdated: '2025-09-29T20:38:50.505Z'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/socket/io': {
      get: {
        tags: ['Real-time'],
        summary: 'WebSocket endpoint',
        description: 'Establish WebSocket connection for real-time data updates',
        responses: {
          '101': {
            description: 'WebSocket connection established'
          },
          '400': {
            description: 'Invalid WebSocket request'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Asset: {
        type: 'object',
        required: ['id', 'name', 'type', 'capacity', 'location', 'lat', 'lng', 'status'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique asset identifier',
            example: 'cmg430xg80001q8kgd2o4yzre'
          },
          name: {
            type: 'string',
            description: 'Human-readable asset name',
            example: 'Wind Farm Beta'
          },
          type: {
            type: 'string',
            enum: ['wind', 'solar', 'battery', 'substation'],
            description: 'Type of energy asset',
            example: 'wind'
          },
          capacity: {
            type: 'number',
            format: 'float',
            description: 'Maximum capacity in MW',
            example: 75.2
          },
          location: {
            type: 'string',
            description: 'Geographical location description',
            example: 'Texas Panhandle'
          },
          lat: {
            type: 'number',
            format: 'float',
            description: 'Latitude coordinate',
            example: 35.3733
          },
          lng: {
            type: 'number',
            format: 'float',
            description: 'Longitude coordinate',
            example: -101.8313
          },
          status: {
            type: 'string',
            enum: ['exporting', 'curtailing', 'offline', 'charging'],
            description: 'Current operational status',
            example: 'exporting'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Asset creation timestamp',
            example: '2025-09-28T19:17:54.393Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2025-09-28T19:17:54.393Z'
          }
        }
      },
      Performance: {
        type: 'object',
        required: ['id', 'assetId', 'timestamp', 'generation', 'availability', 'efficiency'],
        properties: {
          id: {
            type: 'string',
            description: 'Performance record identifier',
            example: 'cmg430xh4000rq8kgc2tuaw44'
          },
          assetId: {
            type: 'string',
            description: 'Associated asset identifier',
            example: 'cmg430xg80001q8kgd2o4yzre'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Performance measurement timestamp',
            example: '2025-09-28T19:17:54.424Z'
          },
          generation: {
            type: 'number',
            format: 'float',
            description: 'Current power generation in MW',
            example: 53.04
          },
          availability: {
            type: 'number',
            format: 'float',
            description: 'Asset availability percentage',
            example: 91.82
          },
          efficiency: {
            type: 'number',
            format: 'float',
            description: 'Operational efficiency percentage',
            example: 85.31
          }
        }
      },
      Alert: {
        type: 'object',
        required: ['id', 'assetId', 'type', 'severity', 'message', 'isRead', 'createdAt'],
        properties: {
          id: {
            type: 'string',
            description: 'Alert identifier',
            example: 'cmg430xhq0031q8kgzb90l25b'
          },
          assetId: {
            type: 'string',
            description: 'Associated asset identifier',
            example: 'cmg430xg80002q8kgw1kpbj3i'
          },
          type: {
            type: 'string',
            enum: ['maintenance', 'performance', 'curtailment', 'temperature', 'voltage', 'weather', 'grid'],
            description: 'Type of alert',
            example: 'curtailment'
          },
          severity: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
            description: 'Alert severity level',
            example: 'medium'
          },
          message: {
            type: 'string',
            description: 'Alert description',
            example: 'Grid operator curtailment order in effect - reducing output by 25%'
          },
          isRead: {
            type: 'boolean',
            description: 'Whether alert has been acknowledged',
            example: false
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Alert creation timestamp',
            example: '2025-09-28T19:17:54.446Z'
          }
        }
      },
      AssetWithDetails: {
        allOf: [
          { $ref: '#/components/schemas/Asset' },
          {
            type: 'object',
            properties: {
              performances: {
                type: 'array',
                description: 'Latest performance record',
                maxItems: 1,
                items: { $ref: '#/components/schemas/Performance' }
              },
              alerts: {
                type: 'array',
                description: 'Active alerts (unread, max 3)',
                maxItems: 3,
                items: { $ref: '#/components/schemas/Alert' }
              }
            }
          }
        ]
      },
      AssetWithHistory: {
        allOf: [
          { $ref: '#/components/schemas/Asset' },
          {
            type: 'object',
            properties: {
              performances: {
                type: 'array',
                description: 'Performance history (last 50 records)',
                maxItems: 50,
                items: { $ref: '#/components/schemas/Performance' }
              },
              alerts: {
                type: 'array',
                description: 'All alerts for this asset',
                items: { $ref: '#/components/schemas/Alert' }
              }
            }
          }
        ]
      },
      Portfolio: {
        type: 'object',
        required: ['id', 'name', 'totalCapacity', 'currentGeneration', 'updatedAt'],
        properties: {
          id: {
            type: 'string',
            description: 'Portfolio identifier',
            example: 'portfolio123'
          },
          name: {
            type: 'string',
            description: 'Portfolio name',
            example: 'Main Portfolio'
          },
          totalCapacity: {
            type: 'number',
            format: 'float',
            description: 'Total portfolio capacity in MW',
            example: 500.5
          },
          currentGeneration: {
            type: 'number',
            format: 'float',
            description: 'Current total generation in MW',
            example: 245.8
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2025-09-28T19:17:54.393Z'
          }
        }
      },
      PortfolioOverview: {
        type: 'object',
        required: ['totalCapacity', 'currentGeneration', 'efficiency', 'assetCount', 'statusCounts', 'lastUpdated'],
        properties: {
          portfolio: {
            oneOf: [
              { $ref: '#/components/schemas/Portfolio' },
              { type: 'null' }
            ],
            description: 'Portfolio details (null if no portfolio configured)'
          },
          totalCapacity: {
            type: 'number',
            format: 'float',
            description: 'Total capacity across all assets in MW',
            example: 500.5
          },
          currentGeneration: {
            type: 'number',
            format: 'float',
            description: 'Current total generation in MW',
            example: 245.8
          },
          efficiency: {
            type: 'number',
            format: 'float',
            description: 'Overall portfolio efficiency percentage',
            example: 89.2
          },
          assetCount: {
            type: 'integer',
            description: 'Total number of assets',
            example: 37
          },
          statusCounts: {
            type: 'object',
            description: 'Count of assets by status',
            additionalProperties: {
              type: 'integer'
            },
            example: {
              exporting: 25,
              curtailing: 5,
              offline: 2,
              charging: 5
            }
          },
          lastUpdated: {
            type: 'string',
            format: 'date-time',
            description: 'Last calculation timestamp',
            example: '2025-09-29T20:38:50.505Z'
          }
        }
      },
      UserSession: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                example: 'operator'
              },
              role: {
                type: 'string',
                example: 'operator'
              }
            }
          },
          expires: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-29T20:00:00.000Z'
          }
        }
      },
      CreateAssetRequest: {
        type: 'object',
        required: ['name', 'type', 'capacity', 'location', 'lat', 'lng'],
        properties: {
          name: {
            type: 'string',
            description: 'Asset name',
            example: 'Wind Farm Alpha'
          },
          type: {
            type: 'string',
            enum: ['wind', 'solar', 'battery', 'substation'],
            example: 'wind'
          },
          capacity: {
            type: 'number',
            format: 'float',
            description: 'Capacity in MW',
            example: 150.5
          },
          location: {
            type: 'string',
            example: 'Kansas Plains'
          },
          lat: {
            type: 'number',
            format: 'float',
            example: 39.0473
          },
          lng: {
            type: 'number',
            format: 'float',
            example: -95.6890
          },
          status: {
            type: 'string',
            enum: ['exporting', 'curtailing', 'offline', 'charging'],
            default: 'offline',
            example: 'offline'
          }
        }
      },
      UpdateAssetRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Updated Asset Name'
          },
          capacity: {
            type: 'number',
            format: 'float',
            example: 200.5
          },
          location: {
            type: 'string',
            example: 'Updated Location'
          },
          lat: {
            type: 'number',
            format: 'float',
            example: 40.0
          },
          lng: {
            type: 'number',
            format: 'float',
            example: -100.0
          },
          status: {
            type: 'string',
            enum: ['exporting', 'curtailing', 'offline', 'charging'],
            example: 'offline'
          }
        }
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Failed to fetch assets'
          }
        }
      }
    }
  }
};

export default withSwagger as OpenApiSpec;