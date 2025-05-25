import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpace } from './PutSpaces';
import { deleteSpace } from './DeleteSpaces';
import { postSpacesWithDocClient } from './PostSpacesWithDocClient';

const dynamoDBClient = new DynamoDB({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  switch (event.httpMethod) {
    case 'GET':
      const getRes = await getSpaces(event, dynamoDBClient);
      console.log('=====>>> Get DynamoDB result:', getRes);
      return getRes;
    case 'POST':
      const postRes = await postSpacesWithDocClient(event, dynamoDBClient);
      console.log('=====>>> Post DynamoDB result:', postRes);
      return postRes;
    case 'PUT':
      const putRes = await updateSpace(event, dynamoDBClient);
      console.log('=====>>> Put DynamoDB result:', putRes);
      return putRes;
    case 'DELETE':
      const deleteRes = await deleteSpace(event, dynamoDBClient);
      console.log('=====>>> Delete DynamoDB result:', deleteRes);
      return deleteRes;
    default:
      message = 'Unsupported HTTP method';
      break;
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message)
  };

  return response;
}

export { handler };
