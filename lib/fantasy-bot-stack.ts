import events = require("@aws-cdk/aws-events");
import targets = require("@aws-cdk/aws-events-targets");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");
require("dotenv").config();

export class FantasyBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
      },
    });

    const rule = new events.Rule(this, "FantasyCron", {
      // 10:30 CST on Tuesdays
      schedule: events.Schedule.cron({
        minute: "30",
        hour: "15",
        weekDay: "2",
      }),
    });

    rule.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}
