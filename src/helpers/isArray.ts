export const isArray = <T>(maybeArray: T | readonly T[]): maybeArray is T[] => {
  return Array.isArray(maybeArray);
};
