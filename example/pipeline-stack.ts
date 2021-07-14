import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import {
  CdkPipeline,
  ShellScriptAction,
  SimpleSynthAction,
} from "@aws-cdk/pipelines";
import { Pr2Pipeline } from "../lib/index";
import { GenericAppStage } from "./generic-app-stage";

export interface Props extends StackProps {
  github: {
    owner: string;
    repo: string;
    branch: string;
  };
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: "Source",
      oauthToken: SecretValue.secretsManager("github-token"),
      owner: props.github.owner,
      repo: props.github.repo,
      branch: props.github.branch,
      output: sourceArtifact,
    });

    const synthAction = SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      buildCommand: "npm install && npm run build",
      environmentVariables: {
        branch: { value: props.github.branch },
      },
    });

    const pipeline = new CdkPipeline(this, "CICD", {
      // The pipeline name
      pipelineName: "GenericServicePipeline",
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction,

      // How it will be built and synthesized
      synthAction,
      singlePublisherPerType: true,
    });

    // This is where we add the application stages
    if (props.github.branch === "main") {
      new Pr2Pipeline(this, "PrTrigger", { github: props.github });
      // need to add deployment to test account and to prod here
    } else {
      // must be a feature branch
      // add deployment to dev account here
      const devStackOptions = { branch: props.github.branch };
      const devApp = new GenericAppStage(this, "Dev", devStackOptions);
      // build and test typescript code
      const devStage = pipeline.addApplicationStage(devApp, {
        manualApprovals: true, // <--- this is set to manual so you don't build stacks by default, just the base stack
      });
      const current_step_number = devStage.nextSequentialRunOrder();
      devStage.addActions(
        new ShellScriptAction({
          actionName: "CDKUnitTests",
          runOrder: current_step_number,
          additionalArtifacts: [sourceArtifact],
          commands: ["npm install", "npm run build", "npm run test"],
        })
      );
      devStage.addActions(
        new ShellScriptAction({
          actionName: "SecOps",
          runOrder: current_step_number,
          additionalArtifacts: [sourceArtifact],
          commands: ["npm install", "npm run build", "npm run test"],
        })
      );
    }
  }
}
