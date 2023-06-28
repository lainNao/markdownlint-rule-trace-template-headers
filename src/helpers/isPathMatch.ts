import minimatch from "minimatch";

export function isPathMatch(filePathA: string, filePathBPattern: string) {
  return minimatch(filePathA, filePathBPattern);
}

export function isPathMatchArray(filePath: string, filePathArray: string[]) {
  return filePathArray.some((filePathPattern) =>
    isPathMatch(filePath, filePathPattern)
  );
}
