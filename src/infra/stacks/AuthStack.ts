import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import {
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
  public userPool!: UserPool;
  private userPoolClient!: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Define your resources here
    this.createUserPool();
    this.createUserPoolClient();
    this.createUserPoolGroup();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, 'SpaceUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true
      }
    });

    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId
    });
  }

  private createUserPoolClient() {
    // this.userPoolClient = new UserPoolClient(this, 'SpaceUserPoolClient', {
    //   userPool: this.userPool,
    //   generateSecret: false,
    //   authFlows: {
    //     userPassword: true,
    //     userSrp: true
    //   }
    // });

    this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        custom: true,
        userSrp: true
      }
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId
    });
  }

  private createUserPoolGroup() {
    new CfnUserPoolGroup(this, 'AdminGroup', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admin'
    });
  }
}
