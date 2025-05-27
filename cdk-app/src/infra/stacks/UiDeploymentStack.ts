import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';
import { join } from 'path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { AccessLevel, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const uiDir = join(__dirname, '..', '..', '..', '..', 'react-app', 'dist');
    if (!uiDir) {
      console.error('UI directory not found');
      return;
    }

    // Create an S3 bucket to store the built frontend assets
    const deploymentBucket = new Bucket(this, 'UiDeploymentBucket', {
      bucketName: `space-finder-ui-deployment-${suffix}`
    });

    // Deploy the contents of the local frontend build directory to the S3 bucket
    new BucketDeployment(this, 'SpaceFinderDeployUI', {
      sources: [Source.asset(uiDir)],
      destinationBucket: deploymentBucket
    });

    // Set up CloudFront distribution using S3BucketOrigin with Origin Access Control (OAC)
    const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
      originAccessLevels: [AccessLevel.READ]
    });

    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: s3Origin
      }
    });

    // Output the CloudFront distribution URL so we can easily access the deployed site
    new CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'The URL to access the deployed website'
    });
  }
}
