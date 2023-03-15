import { JsonPath } from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import { TABLE_NAME } from "../../types";

type GetHomonymsCountProps = { tableArn: string };

export class GetHomonymsCount extends CallAwsService {
  constructor(
    scope: Construct,
    id: string,
    { tableArn }: GetHomonymsCountProps
  ) {
    super(scope, id, {
      service: "dynamodb",
      action: "query",
      iamResources: [tableArn],
      iamAction: "dynamodb:Query",
      resultSelector: { count: JsonPath.stringAt("$.Count") },
      resultPath: "$.taskResult",
      parameters: {
        TableName: TABLE_NAME,
        KeyConditionExpression: `#nameKey = :nameValue`,
        ExpressionAttributeNames: { "#nameKey": "name" },
        ExpressionAttributeValues: {
          ":nameValue": { S: JsonPath.stringAt("$.body.name") },
        },
      },
    });
  }
}
