import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  try {
    const randomId = v4();
    const item = JSON.parse(event.body || ''); // If the body is empty, this will throw an error

    const result = await ddClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: {
            S: randomId
          },
          location: {
            S: item.location
          }
        }
      })
    );

    console.log('=====>>> DynamoDB result:', result);
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: randomId
      })
    };
  } catch (error) {
    console.error('Error in postSpaces:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    };
  }
}
