# Fantasy Football Bot

A cron job that triggers a lambda to send fantasy football updates via GroupMe.

This is a python lambda function that hits the ESPN fantasy football API to request updates before sending messages using the GroupMe API. Infrastructure lives in AWS and is defined/deployed using AWS CDK.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
