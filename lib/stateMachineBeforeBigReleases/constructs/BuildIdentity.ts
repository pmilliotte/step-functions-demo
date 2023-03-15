import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { JsonPath, TaskInput } from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import * as path from "path";

export class BuildIdentity extends LambdaInvoke {
  constructor(scope: Construct, id: string) {
    const buildIdentityFunction = new NodejsFunction(
      scope,
      "BuildIdentityFunction",
      {
        handler: "main",
        entry: path.join(__dirname, `/../functions/buildIdentityHandler.ts`),
      }
    );

    super(scope, id, {
      lambdaFunction: buildIdentityFunction,
      payload: TaskInput.fromJsonPathAt("$"),
      resultSelector: { identity: JsonPath.stringAt("$.Payload") },
    });
  }
}
