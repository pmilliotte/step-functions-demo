import { v4 as uuidv4 } from "uuid";
import { Nationality } from "./types";

const buildFrenchIdNumber = () => `CNI-${uuidv4()}`;
const buildUsIdNumber = () => uuidv4();

export const NATIONAL_ID_BUILDER_MAPPING: {
  [nationality in Nationality]: () => string;
} = {
  FR: buildFrenchIdNumber,
  US: buildUsIdNumber,
};
