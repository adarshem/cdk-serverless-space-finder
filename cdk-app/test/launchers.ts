// import { handler } from '../src/services/hello';
// handler({} as any, {} as any);

import { handler } from '../src/services/spaces/handler';

process.env.TABLE_NAME = 'SpacesTable-0a8d674272cf';
process.env.AWS_REGION = 'us-west-2';

const testfn = async () => {
  const res = await handler(
    {
      httpMethod: 'GET',
      queryStringParameters: {
        id: '2d659f95-26ae-4810-bcf8-72f4beb5b579'
      },
      requestContext:{
        authorizer: {
          claims: {
            'cognito:groups': ['admin']
          }
        }
      }
      // body: JSON.stringify({
      //   location: 'Adarsh test updated'
      // })
    } as any,
    {} as any
  );

  console.log('=====>>> Test function result:', JSON.parse(res.body));
};

testfn();
