import { ITable } from "aws-cdk-lib/aws-dynamodb";
import {
  Choice,
  Condition,
  JsonPath,
  Pass,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { PutIdentity } from "../../sharedConstructs/PutIdentityTask";

const COMMON_PARAMETERS = {
  date: JsonPath.stringAt("$$.State.EnteredTime"),
  name: JsonPath.stringAt("$.body.name"),
  nationality: JsonPath.stringAt("$.body.nationality"),
};

type BuildAndPutIdentityProps = { table: ITable };

export class BuildAndPutIdentity extends Choice {
  constructor(
    scope: Construct,
    id: string,
    { table }: BuildAndPutIdentityProps
  ) {
    super(scope, id);

    const passTaskFr = new Pass(scope, "BuildIdentityFr", {
      parameters: {
        identity: {
          ...COMMON_PARAMETERS,
          "id.$": "States.Format('CNI-{}', $.body.uuid)",
        },
      },
    });
    const passTaskUs = new Pass(scope, "BuildIdentityUs", {
      parameters: {
        identity: {
          ...COMMON_PARAMETERS,
          id: JsonPath.stringAt("$.body.uuid"),
        },
      },
    });

    /*************************  ...AND SAVE IT TO DB... *************************/
    const putIdentityTask = new PutIdentity(this, "PutIdentityTask", {
      table,
    });

    this.when(
      Condition.stringEquals("$.body.nationality", "FR"),
      passTaskFr.next(putIdentityTask)
    );
    this.when(
      Condition.stringEquals("$.body.nationality", "US"),
      passTaskUs.next(putIdentityTask)
    );
  }
}
