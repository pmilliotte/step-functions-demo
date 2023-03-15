export const TABLE_NAME = "Identities";

export const WAIT_FOR_FAKE_COMPUTE_MS = 5000;

export const NATIONALITIES = ["FR", "US"] as const;
export type Nationality = typeof NATIONALITIES[number];

