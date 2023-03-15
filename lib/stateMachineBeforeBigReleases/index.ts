import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { CreateIdentityStateMachine } from "../sharedConstructs/CreateIdentityStateMachine";
import { GetHomonymsCount } from "./constructs/GetHomonymsCount";
import { MapThroughIdentities } from "./constructs/MapThroughIdentities";

type stateMachineBeforeBigReleasesProps = {
  table: ITable;
  shouldWaitForNameValidation?: boolean;
  name: string;
};

export class StateMachineBeforeBigReleases extends CreateIdentityStateMachine {
  constructor(
    scope: Construct,
    id: string,
    {
      table,
      shouldWaitForNameValidation = false,
      name,
    }: stateMachineBeforeBigReleasesProps
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
      shouldWaitForNameValidation,
      stateMachineName: name,
    });
  }
}
