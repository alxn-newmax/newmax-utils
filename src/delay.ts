export const delay = async (ms: number): Promise<boolean> => {
  await new Promise((res) => setTimeout(res, ms * 1000));
  return true;
};
