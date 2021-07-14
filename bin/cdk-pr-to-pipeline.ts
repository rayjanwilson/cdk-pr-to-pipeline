#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkPrToPipelineStack } from '../lib/cdk-pr-to-pipeline-stack';

const app = new cdk.App();
new CdkPrToPipelineStack(app, 'CdkPrToPipelineStack');
