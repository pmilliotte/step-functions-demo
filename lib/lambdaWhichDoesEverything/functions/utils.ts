import { WAIT_FOR_FAKE_COMPUTE_MS } from "../../types";

export const waitForFakeCompute = () => new Promise((resolve) => {
  setTimeout(resolve, WAIT_FOR_FAKE_COMPUTE_MS);
});
