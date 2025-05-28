import { Resource, Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  ResourceOptions,
  RestApi
} from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  lambdaFunctionIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Define your data stack resources here
    const api = new RestApi(this, 'SpacesApi');

    // https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      'SpacesApiAuthorizer',
      {
        cognitoUserPools: [props.userPool],
        identitySource: 'method.request.header.Authorization'
      }
    );
    // Add the authorizer to the API Gateway
    authorizer._attachToApi(api);

    const optionsWithAuth = {
      authorizer: authorizer,
      authorizationType: AuthorizationType.COGNITO
    };

    const resourceCORSOptions: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'], // Allow all origins
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'] // Allow these methods
      }
    };

    const spacesResource = api.root.addResource('spaces', resourceCORSOptions);

    spacesResource.addMethod(
      'GET',
      props.lambdaFunctionIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      'POST',
      props.lambdaFunctionIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      'PUT',
      props.lambdaFunctionIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      'DELETE',
      props.lambdaFunctionIntegration,
      optionsWithAuth
    );
  }
}
