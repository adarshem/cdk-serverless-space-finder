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

function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers['Access-Control-Allow-Origin'] = '*';
  arg.headers['Access-Control-Allow-Methods'] = '*';
}

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getRes = await getSpaces(event, dynamoDBClient);
        response = getRes;
        break;
      case 'POST':
        const postRes = await postSpacesWithDocClient(event, dynamoDBClient);
        return postRes;
      case 'PUT':
        const putRes = await updateSpace(event, dynamoDBClient);
        return putRes;
      case 'DELETE':
        const deleteRes = await deleteSpace(event, dynamoDBClient);
        return deleteRes;
      default:
        message = 'Unsupported HTTP method';
        response = {
          statusCode: 200,
          body: JSON.stringify(message)
        };
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    message = 'Internal server error';
    response = {
      statusCode: 500,
      body: JSON.stringify(message)
    };
  }

  addCorsHeader(response);
  return response;
}

export { handler };
