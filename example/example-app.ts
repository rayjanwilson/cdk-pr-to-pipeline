#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PipelineStack } from "./pipeline-stack";

const github = {
  owner: "rayjanwilson",
  repo: "cdk-pr-to-pipeline",
  branch: "master",
};

if (process.env.CODEBUILD_WEBHOOK_HEAD_REF) {
  github.branch =
    process.env.CODEBUILD_WEBHOOK_HEAD_REF.split("/").pop() || "master";
} else if (process.env.branch) {
  github.branch = process.env.branch;
}

const app = new cdk.App();
new PipelineStack(app, `Example-PR2P-${github.branch}`, {github});
