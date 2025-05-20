import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import { v4 } from 'uuid';

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('context:', JSON.stringify(context, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, world! - read from ${
        process.env.TABLE_NAME
      }. The UUID is ${v4()}`
    })
  };
}

export { handler };
