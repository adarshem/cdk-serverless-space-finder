import { Stack, StackProps } from 'aws-cdk-lib';
import {
  Code,
  Function as LambdaFunction,
  Runtime
} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This code defines a Lambda stack in AWS CDK. It imports necessary modules and creates a Lambda function with Node.js 18.x runtime. The handler is set to 'hello.handler', and the code is loaded from the specified directory.
    new LambdaFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.handler',
      code: Code.fromAsset(join(__dirname, '..', '..', 'services'))
    });
  }
}
