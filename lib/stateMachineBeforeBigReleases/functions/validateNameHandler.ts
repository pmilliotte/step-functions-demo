type Input = { name: string };

export const main = ({ name }: Input): Promise<string> =>
  Promise.resolve(`Name "${name}" is waiting for external validation`);
