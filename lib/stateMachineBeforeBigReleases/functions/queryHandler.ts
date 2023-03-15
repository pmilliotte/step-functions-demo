import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { TABLE_NAME } from "../../types";

const dynamodbClient = new DynamoDBClient({});

export const main = async ({
  name,
}: {
  name: string;
}): Promise<number | undefined> => {
  const command = new QueryCommand({
    KeyConditionExpression: `#nameKey = :nameValue`,
    ExpressionAttributeNames: { "#nameKey": "name" },
    ExpressionAttributeValues: { ":nameValue": { S: name } },
    TableName: TABLE_NAME,
  });
  const { Count } = await dynamodbClient.send(command);

  return Count;
};
