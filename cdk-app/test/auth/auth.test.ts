import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';
import { AwsCredentialIdentity } from '@aws-sdk/types';

async function getS3Buckets(awsCredential: AwsCredentialIdentity) {
  const s3Client = new S3Client({
    credentials: awsCredential
  });

  const listBktCommand = new ListBucketsCommand({});

  const res = await s3Client.send(listBktCommand);

  return res;
}

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('adarshem', 'Ambi@08191010'); // Replace with actual username and password
  // const idToken = await service.getIdToken();
  // console.log('loginResult', loginResult);
  // console.log('idToken', idToken);

  const credentials = await service.generateTemporaryCredentials();
  console.log('Temporary Credentials', credentials);

  if (credentials) {
    const s3Buckets = await getS3Buckets(credentials);
    console.log('S3 Buckets', s3Buckets);
  }
}

testAuth();
