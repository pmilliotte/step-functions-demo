import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { Nationality, TABLE_NAME } from "../../types";
import { NATIONAL_ID_BUILDER_MAPPING } from "../../utils";
import { waitForFakeCompute } from "./utils";

const dynamodbClient = new DynamoDBClient({});

type Input = { body: { name: string; nationalities: Nationality[] } };

export const main = async ({
  body: { name, nationalities },
}: Input): Promise<string[]> => {
  /*************************  QUERY HOMONYMS IN DB *************************/
  const queryCommand = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: `#nameKey = :nameValue`,
    ExpressionAttributeNames: { "#nameKey": "name" },
    ExpressionAttributeValues: { ":nameValue": { S: name } },
  });
  const { Count } = await dynamodbClient.send(queryCommand);

  /*************************  ERROR IF NAME DOES NOT EXIST *************************/
  if (Count === undefined || Count === 0) {
    throw new Error("Name does not exist");
  }

  /************************* IN PARALLEL... *************************/
  const createdIds: string[] = [];
  const date = new Date();
  await Promise.all([
    /************************* ...WAIT FOR 5 SECONDS... *************************/
    waitForFakeCompute(),
    /*************************  ...AND FOR EACH NATIONALITY... *************************/
    ...nationalities.map((nationality) => {
      /*************************  ...BUILD IDENTITY... *************************/
      const id = NATIONAL_ID_BUILDER_MAPPING[nationality]();
      createdIds.push(id);
      const identityPayload = {
        name: { S: name },
        nationality: { S: nationality },
        id: { S: id },
        date: { S: date.toISOString() },
      };

      /*************************  ...AND SAVE IT TO DB... *************************/
      const putItemCommand = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: identityPayload,
      });

      return dynamodbClient.send(putItemCommand);
    }),
  ]);

  /*************************  OUTPUT CREATED IDS *************************/
  return createdIds;
};
