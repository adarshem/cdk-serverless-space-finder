import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';
import { AuthStack } from './stacks/AuthStack';

const app = new App();

const dataStack = new DataStack(app, 'DataStack');

// Create the Lambda stack and pass the DynamoDB table from the DataStack
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  dynnamoTable: dataStack.spacesTable
});

const authStack = new AuthStack(app, 'AuthStack');

// Create the API stack and pass the Lambda function integration from the LambdaStack
new ApiStack(app, 'ApiStack', {
  lambdaFunctionIntegration: lambdaStack.spacesLambdIntegration,
  userPool: authStack.userPool
});
