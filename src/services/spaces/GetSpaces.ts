import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  try {
    if (event.queryStringParameters) {
      if (event.queryStringParameters['id']) {
        const spaceId = event.queryStringParameters['id'];
        const result = await ddClient.send(
          new GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
              id: { S: spaceId }
            }
          })
        );

        if (result.Item) {
          const unmarshalledItem = unmarshall(result.Item); // Does not work well with arrays.
          return {
            statusCode: 200,
            body: JSON.stringify(unmarshalledItem)
          };
        }

        return {
          statusCode: 404,
          body: JSON.stringify({
            message: `Space with id ${spaceId} not found`
          })
        };
      }

      // If no id is provided, return bad request
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Bad Request!. Missing id query parameter.'
        })
      };
    }

    const result = await ddClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME
      })
    );

    const unmarshalledItems = result.Items?.map((item) => {
      return unmarshall(item);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(unmarshalledItems)
    };
  } catch (error) {
    console.error('Error in getSpaces:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    };
  }
}
