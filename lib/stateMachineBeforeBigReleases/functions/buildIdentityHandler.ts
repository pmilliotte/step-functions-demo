import { Nationality } from "../../types";
import { NATIONAL_ID_BUILDER_MAPPING } from "../../utils";

type Input = { name: string; nationality: Nationality };

export const main = ({
  name,
  nationality,
}: Input): Promise<Record<string, string>> => {
  const date = new Date();
  const id = NATIONAL_ID_BUILDER_MAPPING[nationality]();
  const identityPayload = {
    name,
    nationality,
    id,
    date: date.toISOString(),
  };

  return Promise.resolve(identityPayload);
};
