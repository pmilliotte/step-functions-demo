import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { JsonPath, Map } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { BuildAndPutIdentity } from "./BuildAndPutIdentity";

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
        body: {
          name: JsonPath.stringAt("$.body.name"),
          nationality: JsonPath.stringAt("$$.Map.Item.Value"),
          "uuid.$": "States.UUID()",
        },
      },
    });

    const buildAndPutIdentityTask = new BuildAndPutIdentity(
      this,
      "BuildAccordingToNationality",
      { table }
    );

    this.iterator(buildAndPutIdentityTask);
  }
}
