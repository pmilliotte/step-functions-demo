import { Duration } from "aws-cdk-lib";
import {
  Choice,
  Condition,
  Fail,
  Map,
  Parallel,
  StateMachine,
  StateMachineType,
  Succeed,
  TaskStateBase,
  Wait,
  WaitTime,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { ValidateNameAsync } from "../stateMachineBeforeBigReleases/constructs/ValidateNameAsync";
import { WAIT_FOR_FAKE_COMPUTE_MS } from "../types";

type CreateIdentityStateMachineProps = {
  getHomonymsCountTask: TaskStateBase;
  mapThroughIdentitiesTask: Map;
  shouldWaitForNameValidation?: boolean;
  stateMachineName: string;
};

export class CreateIdentityStateMachine extends StateMachine {
  constructor(
    scope: Construct,
    id: string,
    {
      getHomonymsCountTask,
      mapThroughIdentitiesTask,
      shouldWaitForNameValidation = false,
      stateMachineName,
    }: CreateIdentityStateMachineProps
  ) {
    const successTask = new Succeed(scope, "SuccessTask");

    const failTask = new Fail(scope, "FailTask");

    const parallelTask = new Parallel(scope, "ParallelTask", {
      outputPath: "$[1].taskResult",
    });

    const waitForFakeComputeTask = new Wait(scope, "WaitForFakeComputeTask", {
      time: WaitTime.duration(Duration.millis(WAIT_FOR_FAKE_COMPUTE_MS)),
    });

    parallelTask.branch(
      waitForFakeComputeTask,
      mapThroughIdentitiesTask
    );

    const isCountGreaterThanZeroTask = new Choice(
      scope,
      "IsCountGreaterThanZeroTask"
    );
    isCountGreaterThanZeroTask.when(
      Condition.numberGreaterThan("$.taskResult.count", 0),
      parallelTask.next(successTask)
    );

    const validateNameAsync = shouldWaitForNameValidation
      ? new ValidateNameAsync(scope, "ValidateNameAsync")
      : undefined;

    validateNameAsync?.addCatch(failTask, { errors: ["States.TaskFailed"] });
    isCountGreaterThanZeroTask.otherwise(
      validateNameAsync?.next(parallelTask) ?? failTask
    );

    const definition = getHomonymsCountTask.next(isCountGreaterThanZeroTask);

    super(scope, id, {
      definition,
      stateMachineName,
      stateMachineType: StateMachineType.STANDARD,
    });
  }
}
