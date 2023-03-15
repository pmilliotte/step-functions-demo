import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { JsonPath } from "aws-cdk-lib/aws-stepfunctions";
import {
  DynamoAttributeValue,
  DynamoPutItem,
} from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";

type PutIdentityProps = { table: ITable };

export class PutIdentity extends DynamoPutItem {
  constructor(
    scope: Construct,
    id: string,
    { table }: PutIdentityProps
  ) {
    super(scope, id, {
      item: {
        name: DynamoAttributeValue.fromString(
          JsonPath.stringAt("$.identity.name")
        ),
        nationality: DynamoAttributeValue.fromString(
          JsonPath.stringAt("$.identity.nationality")
        ),
        id: DynamoAttributeValue.fromString(JsonPath.stringAt("$.identity.id")),
        date: DynamoAttributeValue.fromString(
          JsonPath.stringAt("$.identity.date")
        ),
      },
      resultPath: "$.taskResult",
      outputPath: "$.identity.id",
      table,
    });
  }
}
