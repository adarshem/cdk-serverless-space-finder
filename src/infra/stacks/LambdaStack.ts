import { Stack, StackProps } from 'aws-cdk-lib';
import {
  Code,
  Function as LambdaFunction,
  Runtime
} from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { join } from 'path';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface LambdaStackProps extends StackProps {
  dynnamoTable: ITable;
}

// This code defines a Lambda stack in AWS CDK. It imports necessary modules and creates a Lambda function with Node.js 18.x runtime. The handler is set to 'hello.handler', and the code is loaded from the specified directory.
// The LambdaIntegration is created to allow the API Gateway to invoke the Lambda function.
export class LambdaStack extends Stack {
  public readonly helloLambdIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    // This code defines a Lambda stack in AWS CDK. It imports necessary modules and creates a Lambda function with Node.js 18.x runtime. The handler is set to 'hello.handler', and the code is loaded from the specified directory.
    const helloLambda = new LambdaFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.handler',
      code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
      environment: {
        TABLE_NAME: props?.dynnamoTable.tableName || ''
      }
    });

    // The LambdaIntegration is created to allow the API Gateway to invoke the Lambda function.
    this.helloLambdIntegration = new LambdaIntegration(helloLambda);
  }
}
