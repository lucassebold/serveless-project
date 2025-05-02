import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isOffline = process.env.IS_OFFLINE === 'true';

const client = new DynamoDBClient({
    ...(isOffline && {
        endpoint: 'http://localhost:8000',
        region: 'local',
        credentials: {
            accessKeyId: 'LOCAL',
            secretAccessKey: 'LOCAL'
        }
    })
});

export const dynamoDb = DynamoDBDocumentClient.from(client); 