import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  lambdaFunctionIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    // Define your data stack resources here
    const api = new RestApi(this, 'SpacesApi');
    const spacesResource = api.root.addResource('spaces');
    spacesResource.addMethod('GET', props?.lambdaFunctionIntegration);
  }
}
