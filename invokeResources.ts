import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { waitForFakeCompute } from "./lib/lambdaWhichDoesEverything/functions/utils";
import uniq from "lodash/uniq";

const sfnClient = new SFNClient({ region: "eu-west-1" });
const lambdaClient = new LambdaClient({ region: "eu-west-1" });

const invokeResources = async () => {
  let name: string;
  for (let step = 0; step < 300; step++) {
    const nationalities = [];
    const rand1 = Math.random();
    const rand2 = Math.random();
    if (rand1 > 0.5) {
      name = "Pierre";
      nationalities.push("FR");
    } else {
      name = "John";
      nationalities.push("US");
    }
    
    if (rand2 > 0.5) {
      nationalities.push("FR");
    } else {
      nationalities.push("US");
    }

    const payload = { body: { name, nationalities: uniq(nationalities) } };
    console.log("step:", step, name, uniq(nationalities));
    const lambdaCommand = new InvokeCommand({
      // @ts-expect-error
      Payload: JSON.stringify(payload),
      FunctionName: "LambdaWhichDoesEverything",
    });
    const sfnCommand = new StartExecutionCommand({
      input: JSON.stringify(payload),
      stateMachineArn:
        "arn:aws:states:eu-west-1:024892491262:stateMachine:after_releases",
    });

    await Promise.all([
      lambdaClient.send(lambdaCommand),
      sfnClient.send(sfnCommand),
      waitForFakeCompute(),
    ]);
  }
};

void invokeResources();
