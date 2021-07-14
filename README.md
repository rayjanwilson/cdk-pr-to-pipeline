# CDK PR 2 Pipeline

There are times when feature-based development with git is preferred. Currently, AWS CodePipeline does not
natively support constructing a stack when a PR is created in GitHub. This construct enables this functionality.

An example of how to integrate into `cdk.pipelines` is provided as well

To use in your project, just `npm install cdk-pr-to-pipeline`