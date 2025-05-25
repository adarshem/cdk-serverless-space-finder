import { Fn, Stack } from 'aws-cdk-lib';
import { APIGatewayProxyEvent } from 'aws-lambda';

export function getSuffixFromStack(stack: Stack): string {
  const shortStackId = Fn.select(2, Fn.split('/', stack.stackId));
  const suffix = Fn.select(4, Fn.split('-', shortStackId));
  return suffix;
}

export function hasUserAdminAccess(event: APIGatewayProxyEvent): boolean {
  const userGroups = event.requestContext.authorizer?.claims[
    'cognito:groups'
  ] as string;
  return Boolean(userGroups?.includes('AdminGroup'));
}
