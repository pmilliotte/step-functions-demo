import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { CreateIdentityStateMachine } from "../sharedConstructs/CreateIdentityStateMachine";
import { GetHomonymsCount } from "./constructs/GetHomonymsCount";
import { MapThroughIdentities } from "./constructs/MapThroughIdentities";

type stateMachineAfterBigReleasesProps = { table: ITable; name: string };

export class StateMachineAfterBigReleases extends CreateIdentityStateMachine {
  constructor(
    scope: Construct,
    id: string,
    { table, name }: stateMachineAfterBigReleasesProps
  ) {
    const getHomonymsCountTask = new GetHomonymsCount(
      scope,
      "GetHomonymsCount",
      { tableArn: table.tableArn }
    );

    const mapThroughIdentitiesTask = new MapThroughIdentities(
      scope,
      "MapThroughNationalities",
      { table }
    );

    super(scope, id, {
      getHomonymsCountTask,
      mapThroughIdentitiesTask,
      stateMachineName: name,
    });
  }
}
