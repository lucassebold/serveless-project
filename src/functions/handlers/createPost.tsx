import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});

export const createPost: APIGatewayProxyHandler = async (event) => {
    try {
        console.log('Starting createPost function');
        // debugger;  // This will force a break
        const body = JSON.parse(event.body || '{}');

        const id = uuidv4();
        const title = body.title;

        console.log('Received body:', body);

        console.log(process.env.IS_OFFLINE);  // Should log 'true' if .env file has IS_OFFLINE=true

        // await client.send(new PutItemCommand({
        //     TableName: 'Posts',
        //     Item: {
        //         id: { S: id },
        //         title: { S: title },
        //     }
        // }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}