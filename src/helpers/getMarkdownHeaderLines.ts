import fs from "fs";
import { isHeaderLine } from "./isHeaderLine";

export function getMarkdownHeaderLines({
  fileContent,
}: {
  fileContent: string;
}): string[] {
  return fileContent
    .split(/\r?\n/)
    .filter((line: string) => isHeaderLine(line));
}
