import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  try {
    // use the static method 'from' to create a new instance of DynamoDBDocumentClient that wraps the DynamoDBClient
    const docClient = DynamoDBDocumentClient.from(ddClient);
    if (event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      if (spaceId) {
        const result = await docClient.send(
          new DeleteCommand({
            TableName: process.env.TABLE_NAME,
            Key: { id: spaceId }
          })
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Item deleted successfully'
          })
        };
      }
    }
    // If no id is provided, return bad request
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request!. Missing id query parameter.'
      })
    };
  } catch (error) {
    console.error('Error in deleteSpace:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    };
  }
}
