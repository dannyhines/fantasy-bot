import { expect as expectCDK, matchTemplate, MatchStyle } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as FantasyBot from "../lib/fantasy-bot-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new FantasyBot.FantasyBotStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {
          FantasyBotServiceRole1C648C94: {
            Type: "AWS::IAM::Role",
            Properties: {
              AssumeRolePolicyDocument: {
                Statement: [
                  {
                    Action: "sts:AssumeRole",
                    Effect: "Allow",
                    Principal: {
                      Service: "lambda.amazonaws.com",
                    },
                  },
                ],
                Version: "2012-10-17",
              },
              ManagedPolicyArns: [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        Ref: "AWS::Partition",
                      },
                      ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
                    ],
                  ],
                },
              ],
            },
          },
          FantasyBot39DAE666: {
            Type: "AWS::Lambda::Function",
            Properties: {
              Code: {
                S3Bucket: {
                  Ref: "AssetParameters4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833S3Bucket99C688EC",
                },
                S3Key: {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::Select": [
                          0,
                          {
                            "Fn::Split": [
                              "||",
                              {
                                Ref: "AssetParameters4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833S3VersionKey0DAEFF8D",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        "Fn::Select": [
                          1,
                          {
                            "Fn::Split": [
                              "||",
                              {
                                Ref: "AssetParameters4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833S3VersionKey0DAEFF8D",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  ],
                },
              },
              Role: {
                "Fn::GetAtt": ["FantasyBotServiceRole1C648C94", "Arn"],
              },
              Environment: {
                Variables: {
                  GM_BOT_ID: "c4d53a412ca0a1ee6180d782ce",
                  FF_LEAGUE_ID: "71381786",
                },
              },
              FunctionName: "FantasyBot",
              Handler: "index.handler",
              Runtime: "nodejs12.x",
              Timeout: 300,
            },
            DependsOn: ["FantasyBotServiceRole1C648C94"],
          },
          FantasyCron48F0F293: {
            Type: "AWS::Events::Rule",
            Properties: {
              ScheduleExpression: "cron(30 16 ? * SUN,TUE *)",
              State: "ENABLED",
              Targets: [
                {
                  Arn: {
                    "Fn::GetAtt": ["FantasyBot39DAE666", "Arn"],
                  },
                  Id: "Target0",
                },
              ],
            },
          },
          FantasyCronAllowEventRuleMyTestStackFantasyBot3ABBFE40FD12A159: {
            Type: "AWS::Lambda::Permission",
            Properties: {
              Action: "lambda:InvokeFunction",
              FunctionName: {
                "Fn::GetAtt": ["FantasyBot39DAE666", "Arn"],
              },
              Principal: "events.amazonaws.com",
              SourceArn: {
                "Fn::GetAtt": ["FantasyCron48F0F293", "Arn"],
              },
            },
          },
          apiC8550315: {
            Type: "AWS::ApiGateway::RestApi",
            Properties: {
              Description: "Fantasy Football GroupMe callback",
              Name: "api",
            },
          },
          apiCloudWatchRoleAC81D93E: {
            Type: "AWS::IAM::Role",
            Properties: {
              AssumeRolePolicyDocument: {
                Statement: [
                  {
                    Action: "sts:AssumeRole",
                    Effect: "Allow",
                    Principal: {
                      Service: "apigateway.amazonaws.com",
                    },
                  },
                ],
                Version: "2012-10-17",
              },
              ManagedPolicyArns: [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        Ref: "AWS::Partition",
                      },
                      ":iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
                    ],
                  ],
                },
              ],
            },
          },
          apiAccount57E28B43: {
            Type: "AWS::ApiGateway::Account",
            Properties: {
              CloudWatchRoleArn: {
                "Fn::GetAtt": ["apiCloudWatchRoleAC81D93E", "Arn"],
              },
            },
            DependsOn: ["apiC8550315"],
          },
          apiDeployment149F1294346195dfabad759381d0bf0c74bff72c: {
            Type: "AWS::ApiGateway::Deployment",
            Properties: {
              RestApiId: {
                Ref: "apiC8550315",
              },
              Description: "Automatically created by the RestApi construct",
            },
            DependsOn: ["apicallbackPOST485C17AD", "apicallbackF03A1B56"],
          },
          apiDeploymentStageprod896C8101: {
            Type: "AWS::ApiGateway::Stage",
            Properties: {
              RestApiId: {
                Ref: "apiC8550315",
              },
              DeploymentId: {
                Ref: "apiDeployment149F1294346195dfabad759381d0bf0c74bff72c",
              },
              StageName: "prod",
            },
          },
          apicallbackF03A1B56: {
            Type: "AWS::ApiGateway::Resource",
            Properties: {
              ParentId: {
                "Fn::GetAtt": ["apiC8550315", "RootResourceId"],
              },
              PathPart: "callback",
              RestApiId: {
                Ref: "apiC8550315",
              },
            },
          },
          apicallbackPOSTApiPermissionMyTestStackapi725F2A80POSTcallback3511DED9: {
            Type: "AWS::Lambda::Permission",
            Properties: {
              Action: "lambda:InvokeFunction",
              FunctionName: {
                "Fn::GetAtt": ["FantasyBot39DAE666", "Arn"],
              },
              Principal: "apigateway.amazonaws.com",
              SourceArn: {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      Ref: "AWS::Partition",
                    },
                    ":execute-api:",
                    {
                      Ref: "AWS::Region",
                    },
                    ":",
                    {
                      Ref: "AWS::AccountId",
                    },
                    ":",
                    {
                      Ref: "apiC8550315",
                    },
                    "/",
                    {
                      Ref: "apiDeploymentStageprod896C8101",
                    },
                    "/POST/callback",
                  ],
                ],
              },
            },
          },
          apicallbackPOSTApiPermissionTestMyTestStackapi725F2A80POSTcallback36C34B03: {
            Type: "AWS::Lambda::Permission",
            Properties: {
              Action: "lambda:InvokeFunction",
              FunctionName: {
                "Fn::GetAtt": ["FantasyBot39DAE666", "Arn"],
              },
              Principal: "apigateway.amazonaws.com",
              SourceArn: {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      Ref: "AWS::Partition",
                    },
                    ":execute-api:",
                    {
                      Ref: "AWS::Region",
                    },
                    ":",
                    {
                      Ref: "AWS::AccountId",
                    },
                    ":",
                    {
                      Ref: "apiC8550315",
                    },
                    "/test-invoke-stage/POST/callback",
                  ],
                ],
              },
            },
          },
          apicallbackPOST485C17AD: {
            Type: "AWS::ApiGateway::Method",
            Properties: {
              HttpMethod: "POST",
              ResourceId: {
                Ref: "apicallbackF03A1B56",
              },
              RestApiId: {
                Ref: "apiC8550315",
              },
              AuthorizationType: "NONE",
              Integration: {
                IntegrationHttpMethod: "POST",
                Type: "AWS_PROXY",
                Uri: {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        Ref: "AWS::Partition",
                      },
                      ":apigateway:",
                      {
                        Ref: "AWS::Region",
                      },
                      ":lambda:path/2015-03-31/functions/",
                      {
                        "Fn::GetAtt": ["FantasyBot39DAE666", "Arn"],
                      },
                      "/invocations",
                    ],
                  ],
                },
              },
            },
          },
        },
        Parameters: {
          AssetParameters4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833S3Bucket99C688EC: {
            Type: "String",
            Description: 'S3 bucket for asset "4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833"',
          },
          AssetParameters4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833S3VersionKey0DAEFF8D: {
            Type: "String",
            Description: 'S3 key for asset version "4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833"',
          },
          AssetParameters4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833ArtifactHash8A185FCC: {
            Type: "String",
            Description: 'Artifact hash for asset "4627f5655df2ed8ffd17bc9e279d0142894d635d27047daad3a31683181c2833"',
          },
        },
        Outputs: {
          apiEndpoint9349E63C: {
            Value: {
              "Fn::Join": [
                "",
                [
                  "https://",
                  {
                    Ref: "apiC8550315",
                  },
                  ".execute-api.",
                  {
                    Ref: "AWS::Region",
                  },
                  ".",
                  {
                    Ref: "AWS::URLSuffix",
                  },
                  "/",
                  {
                    Ref: "apiDeploymentStageprod896C8101",
                  },
                  "/",
                ],
              ],
            },
          },
        },
      },
      MatchStyle.EXACT
    )
  );
});
