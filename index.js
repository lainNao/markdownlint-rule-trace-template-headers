const fs = require("fs");
const path = require("path");
const minimatch = require("minimatch");
const appRoot = require("app-root-path");
const appRootPath = appRoot.path;

function isHeaderLine(line) {
  return line.match(/^#+\s/);
}
function isPathMatch(filePathA, filePathBPattern) {
  return minimatch(filePathA, filePathBPattern);
}
function isPathMatchArray(filePath, filePathArray) {
  return filePathArray.some((filePathPattern) =>
    isPathMatch(filePath, filePathPattern)
  );
}

module.exports = {
  names: ["markdownlint-rule-trace-template-headers"],
  description: "Rule that checks the headers is same to template",
  information: new URL("https://github.com/lainNao/markdownlint-rule-trace-template-headers"), //TODO: Get this value from package.json
  tags: ["headers", "headings", "template"],
  function: function rule(params, onError) {
    // Return if the config.markdownlint-rule-trace-template-headers is falsy.
    if (!params.config) {
      return;
    }

    // Return if the file is not match the glob pattern of params.config.filePattern
    const fileNameFromAppRoot = path.relative(appRootPath, params.name);
    const includedFiles = params.config.includedFiles;
    if (
      includedFiles &&
      !isPathMatchArray(fileNameFromAppRoot, includedFiles)
    ) {
      return;
    }

    // Return if the file is match the glob pattern of params.config.excludedFiles
    const excludedFiles = params.config.excludedFiles;
    if (excludedFiles && isPathMatchArray(fileNameFromAppRoot, excludedFiles)) {
      return;
    }

    const templateFile = path.join(appRootPath, params.config.templateFile);

    // check if template file exists
    if (!fs.existsSync(templateFile)) {
      onError({
        lineNumber: 1,
        detail: `Template file '${JSON.stringify(
          templateFile
        )}' does not exist. Please specify a valid template file.`,
        context: params.lines[0],
      });
      return;
    }

    // get template headers
    const templateHeaders = [];
    fs.readFileSync(templateFile, "utf8")
      .split(/\r?\n/)
      .forEach((line, index) => {
        if (isHeaderLine(line)) {
          templateHeaders.push(line);
        }
      });

    // check if headers are equal
    const foundedHeaders = [];
    params.lines.forEach((line, lineIndex) => {
      if (isHeaderLine(line)) {
        const targetHeader = templateHeaders[foundedHeaders.length];
        if (targetHeader !== line) {
          onError({
            lineNumber: lineIndex + 1,
            detail: `Template file '${JSON.stringify(
              templateFile
            )}' and current file have different headers or different headers order. Expected: ${targetHeader}, given: ${line}`,
            context: params.lines[lineIndex],
          });
          return;
        }

        foundedHeaders.push(line);
      }
    });

    // check if headers count is equal
    if (foundedHeaders.length !== templateHeaders.length) {
      const isFoundedLess = foundedHeaders.length < templateHeaders.length;
      onError({
        lineNumber: isFoundedLess ? params.lines.length : 1,
        detail: `Template file '${JSON.stringify(
          templateFile
        )}' and current file have different headers count. Expected: ${
          templateHeaders.length
        }, given: ${foundedHeaders.length}`,
        context: params.lines[0],
      });
    }

    return;
  },
};
