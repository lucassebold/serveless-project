import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const client = new DynamoDBClient({});
const sqs = new SQSClient({});

const TABLE_NAME = "Posts";
const QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/084889387772/PostQueue";

export const schedulePosts = async () => {
    const posts = await client.send(new ScanCommand({
        TableName: TABLE_NAME
    }));


    for (const post of posts.Items) {
        await sqs.send(new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(post),
        }));
    }

    return { statusCode: 200, body: 'Posts scheduled for publishing' };
}