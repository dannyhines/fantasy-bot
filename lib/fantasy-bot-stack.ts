import events = require("@aws-cdk/aws-events");
import targets = require("@aws-cdk/aws-events-targets");
import lambda = require("@aws-cdk/aws-lambda");
import apigateway = require("@aws-cdk/aws-apigateway");
import cdk = require("@aws-cdk/core");
require("dotenv").config();

export class FantasyBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // LAMBDA FUNCTION

    const lambdaFn = new lambda.Function(this, "FantasyBot", {
      code: new lambda.AssetCode("lambda", {
        exclude: ["*.ts", "*.d.ts"],
      }),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "FantasyBot",
      environment: {
        GM_BOT_ID: process.env.GM_BOT_ID || "",
        FF_LEAGUE_ID: process.env.FF_LEAGUE_ID || "",
      },
    });

    // CRON JOB

    // (10:30 AM CST on Sunday, Monday and Tuesdays)
    const rule = new events.Rule(this, "FantasyCron", {
      schedule: events.Schedule.cron({ minute: "30", hour: "16", weekDay: "SUN,TUE" }),
    });
    rule.addTarget(new targets.LambdaFunction(lambdaFn));

    // API
    const api = new apigateway.RestApi(this, "api", {
      description: "Fantasy Football GroupMe callback",
    });

    // Create the endpoint and connect it to the lambda function
    const callback = api.root.addResource("callback");
    callback.addMethod("POST", new apigateway.LambdaIntegration(lambdaFn, { proxy: true }));
  }
}
