import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { JsonPath, Map } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { BuildIdentity } from "./BuildIdentity";
import { PutIdentity } from "../../sharedConstructs/PutIdentityTask";

type MapThroughIdentitiesProps = { table: ITable };

export class MapThroughIdentities extends Map {
  constructor(
    scope: Construct,
    id: string,
    { table }: MapThroughIdentitiesProps
  ) {
    /*************************  ...AND FOR EACH NATIONALITY... *************************/
    super(scope, id, {
      itemsPath: JsonPath.stringAt("$.body.nationalities"),
      resultPath: "$.taskResult",
      parameters: {
        name: JsonPath.stringAt("$.body.name"),
        nationality: JsonPath.stringAt("$$.Map.Item.Value"),
      },
    });

    const buildIdentityTask = new BuildIdentity(this, "BuildIdentity");

    /*************************  ...AND SAVE IT TO DB... *************************/
    const putIdentityTask = new PutIdentity(this, "PutIdentityTask", {
      table,
    });

    this.iterator(buildIdentityTask.next(putIdentityTask));
  }
}
