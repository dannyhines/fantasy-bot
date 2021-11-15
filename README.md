# Fantasy Football Bot

A cron job that triggers a lambda to send fantasy football updates via GroupMe.

This is a Typescript lambda function that hits the ESPN fantasy football API to request updates before sending messages using the GroupMe API. Infrastructure lives in AWS and is defined/deployed using AWS CDK.

## Setup

Use [this link](https://dev.groupme.com/tutorials/bots) to create a GroupMe bot, and copy the bot ID.

This API connects to the ESPN Fantasy Football API. To find your league ID, click on your league online and the url should change to

```
https://fantasy.espn.com/football/league?leagueId=[your league ID here]
```

Create a .env file in the root directory and add those IDs:

```
GM_BOT_ID=abcd1234
FF_LEAGUE_ID=1234567
```

In the root `fantasy-bot/` directory:

```
cd lambda
npm install      // download lambda's dependencies
cd ..
npm install      // download cdk's dependencies
npm run build
```

This will download npm modules for both the infrastructure and the lambda itself, and compile the typescript to javascript.

## Making Changes

The `bin` directory contains the binary that creates the Cloudformation stack, and the `lib` folder is where you'll build the stack itself.

Whether you change the lambda or the infrastructure, simply run `npm run build` from the root directory.

## Deploy

Run `cdk deploy`. This will deploy / redeploy your Stack to your AWS Account.

You'll need to download the CDK CLI if you don't have it already:

```
npm install -g aws-cdk
```

### Commands

- `npm run build` compile typescript to js
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` prints the generated CloudFormation template
