#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FantasyBotStack } from "../lib/fantasy-bot-stack";

const app = new cdk.App();
new FantasyBotStack(app, "FantasyBotStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  // env: { account: '123456789012', region: 'us-east-1' },
});
