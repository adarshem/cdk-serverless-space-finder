import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'eu-west-2';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_n3Q0btEGL',
      userPoolClientId: 'm21np3t2295nt8js54efclpqm',
      identityPoolId: 'us-west-2:b76b8934-3c57-419f-a02d-aa88d41a87a0'
    }
  }
});

export class AuthService {
  public async login(userName: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: userName,
      password: password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH'
      }
    });
    return signInOutput;
  }

  /**
   * call only after login
   */
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession?.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    if (!idToken) {
      throw new Error(
        'ID token is undefined. Please ensure the user is logged in.'
      );
    }
    const cognitoIdentityPool =
      'cognito-idp.us-west-2.amazonaws.com/us-west-2_n3Q0btEGL';
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'us-west-2:b76b8934-3c57-419f-a02d-aa88d41a87a0',
        logins: {
          [cognitoIdentityPool]: idToken
        }
      })
    });
    try {
      const credentials = await cognitoIdentity.config.credentials();
      return credentials;
    } catch (error) {
      console.error('Error generating temporary credentials:', error);
      return null;
    }
  }
}
