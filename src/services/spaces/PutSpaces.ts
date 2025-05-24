import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  try {
    // use the static method 'from' to create a new instance of DynamoDBDocumentClient that wraps the DynamoDBClient
    const docClient = DynamoDBDocumentClient.from(ddClient);
    if (event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      if (spaceId && event.body) {
        const body = JSON.parse(event.body);
        const result = await docClient.send(
          new UpdateCommand({
            TableName: process.env.TABLE_NAME,
            Key: { id: spaceId },
            UpdateExpression: 'SET #someKey = :someValue',
            ExpressionAttributeNames: {
              '#someKey': Object.keys(body)[0] // Avoids conflicts with reserved words like name, status, etc.
            },
            ExpressionAttributeValues: {
              ':someValue': Object.values(body)[0] // Values you want to use in the update
            },
            ReturnValues: 'UPDATED_NEW' // Optional â€” tells DynamoDB what to return (e.g., updated item)
          })
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Item updated successfully',
            item: result.Attributes // returns the updated item
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
    console.error('Error in putSpaces:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    };
  }
}
