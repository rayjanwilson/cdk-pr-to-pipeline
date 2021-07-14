import * as cdk from '@aws-cdk/core';
import { Pr2Pipeline} from '../../src/cdk-pr-to-pipeline'

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}
