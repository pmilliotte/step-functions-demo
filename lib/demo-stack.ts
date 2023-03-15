import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { LambdaWhichDoesEverything } from "./lambdaWhichDoesEverything";
import { StateMachineAfterBigReleases } from "./stateMachineAfterBigReleases";
import { StateMachineBeforeBigReleases } from "./stateMachineBeforeBigReleases";
import { TABLE_NAME } from "./types";

export class DemoStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new Table(this, "Table", {
      partitionKey: { name: "name", type: AttributeType.STRING },
      sortKey: { name: "id", type: AttributeType.STRING },
      tableName: TABLE_NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new LambdaWhichDoesEverything(this, "LambdaWhichDoesEverything", {
      tableArn: table.tableArn,
    });

    new StateMachineBeforeBigReleases(this, "StateMachineBeforeBigReleases", {
      table,
      name: "before_releases",
    });

    new StateMachineBeforeBigReleases(
      this,
      "StateMachineBeforeBigReleasesWithNameValidation",
      {
        table,
        shouldWaitForNameValidation: true,
        name: "with_name_validation",
      }
    );

    new StateMachineAfterBigReleases(this, "StateMachineAfterBigReleases", {
      table,
      name: "after_releases",
    });
  }
}
