// import { handler } from '../src/services/hello';
// handler({} as any, {} as any);

import { handler } from '../src/services/spaces/handler';

process.env.TABLE_NAME = 'SpacesTable-0a3175d3bd61';
process.env.AWS_REGION = 'us-west-2';

const testfn = async () => {
  const res = await handler(
    {
      httpMethod: 'DELETE',
      queryStringParameters: {
        id: '11ee641c-d690-4d9a-a70f-a0694e80b1cc'
      },
      // body: JSON.stringify({
      //   location: 'Adarsh test updated'
      // })
    } as any,
    {} as any
  );

  console.log('=====>>> Test function result:', JSON.parse(res.body));
};

testfn();
