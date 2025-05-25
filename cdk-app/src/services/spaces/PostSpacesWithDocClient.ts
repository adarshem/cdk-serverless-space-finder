import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

export async function postSpacesWithDocClient(
  event: APIGatewayProxyEvent,
  ddClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  try {
    const randomId = v4();
    const item = JSON.parse(event.body || ''); // If the body is empty, this will throw an error
    console.log('====>>>>> item', item);

    // use the static method 'from' to create a new instance of DynamoDBDocumentClient that wraps the DynamoDBClient
    const docClient = DynamoDBDocumentClient.from(ddClient);

    // Use the PutCommand from @aws-sdk/lib-dynamodb to put the item into the DynamoDB table
    const result = await docClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: randomId,
          ...item
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
