import { Construct, Stage, StageProps } from '@aws-cdk/core';
import { GenericAppStack } from './generic-app';

export interface Props extends StageProps {
  branch: string;
}

export class GenericAppStage extends Stage {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);

    let suffix = '';
    if (!props?.branch) {
      suffix = 'Main';
    } else if (props.branch == 'main') {
      suffix = 'Main';
    } else {
      suffix = `Issue-${props.branch.split('-')[0]}`;
    }

    new GenericAppStack(this, `ExampleGenericApp-${suffix}`, {
      tags: {
        Application: 'GenericApp',
        Environment: id,
        Branch: suffix,
      },
    });
  }
}
