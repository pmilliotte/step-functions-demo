import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  JsonPath,
  TaskInput,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  LambdaInvoke,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import * as path from "path";

type GetHomonymsCountProps = { tableArn: string };

export class GetHomonymsCount extends LambdaInvoke {
  constructor(
    scope: Construct,
    id: string,
    { tableArn }: GetHomonymsCountProps
  ) {
    /*************************  QUERY ITEMS WITH SAME NAME IN DB *************************/
    const role = new Role(scope, "LambdaWhichDoesEverythingRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [tableArn],
      })
    );
    const getHomonymsCountFunction = new NodejsFunction(
      scope,
      "GetHomonymsCountFunction",
      {
        handler: "main",
        entry: path.join(__dirname, `/../functions/queryHandler.ts`),
        role,
      }
    );

    super(scope, id, {
      lambdaFunction: getHomonymsCountFunction,
      payload: TaskInput.fromJsonPathAt("$.body"),
      resultSelector: { count: JsonPath.stringAt("$.Payload") },
      resultPath: "$.taskResult",
    });
  }
}
