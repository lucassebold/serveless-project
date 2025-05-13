import { SQSEvent } from "aws-lambda"
import axios from 'axios';
import { FacebookPostResponseDto } from "src/dto/FacebookPostResponseDto";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "Posts";
const client = new DynamoDBClient({});

const PAGE_ACCESS_TOKEN = "123";
const PAGE_ID = "123";

export const publishPost = async (event: SQSEvent): Promise<void> => {
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const { title, mediaUrl } = body;

            const response = await axios.post<FacebookPostResponseDto>(
                `https://graph.facebook.com/${PAGE_ID}/photos`,
                null,
                {
                    params: {
                        url: mediaUrl,
                        caption: title,
                        access_token: PAGE_ACCESS_TOKEN,
                    },
                }
            );

            if (response.data && response.data.id) {
                await updatePost(body.id);
            } else {
                body.status = 'error';
                console.log('Failed to publish post:', body);
            }

        }
        catch (error) {
            console.log("Failed to publish post", error)
        }
    }
}


const updatePost = async (postId: string): Promise<void> => {

    await client.send(
        new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: {
                id: { S: postId },
            },
            UpdateExpression: 'SET #status = :status',
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ExpressionAttributeValues: {
                ':status': { S: 'published' }
            },
        })
    );
}






