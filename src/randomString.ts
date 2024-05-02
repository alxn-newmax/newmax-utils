export const randomString = (length: number = 9): string => {
  return Math.random().toString(17).substring(2, length + 2);
};

