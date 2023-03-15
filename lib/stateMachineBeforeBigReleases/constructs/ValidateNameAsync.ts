import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  IntegrationPattern,
  JsonPath,
  TaskInput,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import * as path from "path";

export class ValidateNameAsync extends LambdaInvoke {
  constructor(scope: Construct, id: string) {
    const validateNameFunction = new NodejsFunction(
      scope,
      "ValidateNameAsyncFunction",
      {
        functionName: "validateName",
        handler: "main",
        entry: path.join(__dirname, `/../functions/validateNameHandler.ts`),
      }
    );

    super(scope, id, {
      lambdaFunction: validateNameFunction,
      integrationPattern: IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: TaskInput.fromObject({
        name: JsonPath.stringAt("$.body.name"),
        taskToken: JsonPath.taskToken,
      }),
      resultPath: JsonPath.DISCARD,
    });
  }
}
