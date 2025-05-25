import { Stack, StackProps } from 'aws-cdk-lib';
import {
  AttributeType,
  Table as DynamoTable,
  ITable
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../../infra/utils';

export class DataStack extends Stack {
  public readonly spacesTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const stackSuffix = getSuffixFromStack(this);
    const dynamoTable = new DynamoTable(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: `SpacesTable-${stackSuffix}`
    });

    this.spacesTable = dynamoTable;
  }
}
