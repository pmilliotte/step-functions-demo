import { Duration, Stack } from "aws-cdk-lib";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

type LambdaWhichDoesEverythingProps = { tableArn: string };

export class LambdaWhichDoesEverything extends NodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    { tableArn }: LambdaWhichDoesEverythingProps
  ) {
    const role = new Role(scope, "LambdaWhichDoesEverythingRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query", "dynamodb:PutItem"],
        resources: [tableArn],
      })
    );

    super(scope, id, {
      functionName: "LambdaWhichDoesEverything",
      handler: "main",
      entry: path.join(__dirname, `/functions/handler.ts`),
      role,
      timeout: Duration.seconds(10),
    });
  }
}
