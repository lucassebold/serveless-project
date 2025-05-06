import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'my-project',
  frameworkVersion: '3',
  org: 'sebolds',
  app: 'my-project',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    profile: 'Lucas',
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      POSTS_TABLE: '${self:service}-posts-${self:provider.stage}',
      POST_QUEUE_URL: { 'Ref': 'PostQueue' }
    },
    logs: {
      restApi: {
        accessLogging: false,
        executionLogging: false
      }
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:DeleteItem',
              'dynamodb:UpdateItem'
            ],
            Resource: [
              { "Fn::GetAtt": ["PostsTable", "Arn"] }
            ],
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage'
            ],
            Resource: [
              { "Fn::GetAtt": ["PostQueue", "Arn"] }
            ]
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: {
    createPost: {
      handler: 'src/functions/handlers/createPost.createPost',
      events: [
        {
          http: {
            path: 'posts',
            method: 'post',
          },
        },
      ],
    },
    schedulePosts: {
      handler: 'src/functions/handlers/schedulePosts.schedulePosts',
      events: [
        {
          // schedule: 'rate(1 minute)',
          http: {
            path: 'schedule',
            method: 'post',
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      tsconfig: './tsconfig.json'
    },
  },
  resources: {
    Resources: {
      PostsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Posts',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ]
        }
      },
      PostQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'PostQueue'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
