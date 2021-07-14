# CDK PR 2 Pipeline

There are times when feature-based development with git is preferred. Currently, AWS CodePipeline does not
natively support constructing a stack when a PR is created in GitHub. This construct enables this functionality.

An example of how to integrate into `cdk.pipelines` is provided as well

To use in your project, just `npm install cdk-pr-to-pipeline`

## Notes about the construct

- it triggers builds on `PULL_REQUEST_CREATED` and `PULL_REQUEST_REOPENED`
- it triggers deletions on `PULL_REQUEST_MERGED`

## Notes about the example

- the github token has been stored in Secrets Manager
- the pr-to-pipeline construct is only deployed when the branch is `main`, not for any feature branch, since it is what stands up the feature branch stack
- any s3 buckets created by this example will have to be manually deleted