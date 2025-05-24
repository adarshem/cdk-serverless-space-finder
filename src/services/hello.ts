import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import { v4 } from 'uuid';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('context:', JSON.stringify(context, null, 2));
  const listBucketCommand = new ListBucketsCommand({});
  const buckets = (await s3Client.send(listBucketCommand)).Buckets;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, world! - read from ${
        process.env.TABLE_NAME
      }. The UUID is ${v4()}. Following are the buckets: ${JSON.stringify(
        buckets
      )}`
    })
  };
}

export { handler };
