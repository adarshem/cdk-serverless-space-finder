import { Stack, StackProps } from 'aws-cdk-lib';
import {
  Code,
  Function as LambdaFunction,
  Runtime
} from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { join } from 'path';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface LambdaStackProps extends StackProps {
  dynnamoTable: ITable;
}

// This code defines a Lambda stack in AWS CDK. It imports necessary modules and creates a Lambda function with Node.js 18.x runtime. The handler is set to 'hello.handler', and the code is loaded from the specified directory.
// The LambdaIntegration is created to allow the API Gateway to invoke the Lambda function.
export class LambdaStack extends Stack {
  public readonly spacesLambdIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    // This code defines a Lambda stack in AWS CDK. It imports necessary modules and creates a Lambda function with Node.js 18.x runtime. The handler is set to 'hello.handler', and the code is loaded from the specified directory.
    // const helloLambda = new LambdaFunction(this, 'HelloLambda', {
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'hello.handler',
    //   code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
    //   environment: {
    //     TABLE_NAME: props?.dynnamoTable.tableName || ''
    //   }
    // });

    // The NodejsFunction is a higher-level construct that simplifies the creation of Lambda functions using Node.js.
    // It automatically handles bundling and other configurations.
    // This also allows you to use TypeScript and other modern JavaScript features in your Lambda function.
    // This also tree shakes the code, so only the necessary parts are included in the final bundle.
    const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts'), // Path to your Lambda function code
      handler: 'handler',
      environment: {
        TABLE_NAME: props?.dynnamoTable?.tableName || ''
      }
    });

    // Grant the lambd to list the buckets
    // helloLambda.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['s3:ListAllMyBuckets', 's3:ListBucket'],
    //     resources: ['arn:aws:s3:::*'] // You can restrict this to specific resources if needed
    //   })
    // );

    // Grant the Lambda function permissions to read and write to the DynamoDB table
    spacesLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props?.dynnamoTable?.tableArn || ''],
        actions: [
          'dynamodb:PutItem',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ]
      })
    );

    // The LambdaIntegration is created to allow the API Gateway to invoke the Lambda function.
    this.spacesLambdIntegration = new LambdaIntegration(spacesLambda);
  }
}
