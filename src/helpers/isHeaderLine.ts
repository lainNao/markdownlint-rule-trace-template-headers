export function isHeaderLine(line: string) {
  return line.match(/^#+\s/);
}