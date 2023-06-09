"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const minimatch_1 = __importDefault(require("minimatch"));
const app_root_path_1 = __importDefault(require("app-root-path"));
var appRootPath = app_root_path_1.default.path;
function isHeaderLine(line) {
    return line.match(/^#+\s/);
}
function isPathMatch(filePathA, filePathBPattern) {
    return (0, minimatch_1.default)(filePathA, filePathBPattern);
}
function isPathMatchArray(filePath, filePathArray) {
    return filePathArray.some((filePathPattern) => isPathMatch(filePath, filePathPattern));
}
/**
 *
 * @param config The config of markdownlint-rule-trace-template-headers
 * @returns true if the config is MarkdownLintRuleTraceTemplateHeadersConfig
 * @throws Error if the config is not MarkdownLintRuleTraceTemplateHeadersConfig
 * @todo Add more precise error message
 */
function isMarkdownLintRuleTraceTemplateHeadersConfigOrThrowError(config) {
    if (!config) {
        throw new Error("config does not set.");
    }
    if (!config.templateFile) {
        throw new Error("config.templateFile does not set.");
    }
    if (!config.includedFiles) {
        throw new Error("config.includedFiles does not set.");
    }
    if (!Array.isArray(config.includedFiles)) {
        throw new Error("config.includedFiles is not array.");
    }
    if (config.excludedFiles && !Array.isArray(config.excludedFiles)) {
        throw new Error("config.excludedFiles is not array.");
    }
    return true;
}
const rule = {
    names: ["markdownlint-rule-trace-template-headers"],
    description: "Rule that checks the headers is same to template",
    //TODO: Get this value from package.json
    information: new URL("https://github.com/lainNao/markdownlint-rule-trace-template-headers"),
    tags: ["headers", "headings", "template"],
    function: function rule(params, onError) {
        // Return if the config.markdownlint-rule-trace-template-headers is falsy.
        const config = params.config;
        try {
            if (isMarkdownLintRuleTraceTemplateHeadersConfigOrThrowError(config)) {
                console.log(config);
                // Return if the file is not match the glob pattern of params.config.filePattern
                const fileNameFromAppRoot = path_1.default.relative(appRootPath, params.name);
                const includedFiles = params.config.includedFiles;
                if (includedFiles &&
                    !isPathMatchArray(fileNameFromAppRoot, includedFiles)) {
                    return;
                }
                // Return if the file is match the glob pattern of params.config.excludedFiles
                const excludedFiles = params.config.excludedFiles;
                if (excludedFiles &&
                    isPathMatchArray(fileNameFromAppRoot, excludedFiles)) {
                    return;
                }
                const templateFile = path_1.default.join(appRootPath, params.config.templateFile);
                // check if template file exists
                if (!fs_1.default.existsSync(templateFile)) {
                    onError({
                        lineNumber: 1,
                        detail: `Template file '${JSON.stringify(templateFile)}' does not exist. Please specify a valid template file.`,
                        context: params.lines[0],
                    });
                    return;
                }
                // get template headers
                const templateHeaders = [];
                fs_1.default.readFileSync(templateFile, "utf8")
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
                                detail: `Template file '${JSON.stringify(templateFile)}' and current file have different headers or different headers order. Expected: ${targetHeader}, given: ${line}`,
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
                        detail: `Template file '${JSON.stringify(templateFile)}' and current file have different headers count. Expected: ${templateHeaders.length}, given: ${foundedHeaders.length}`,
                        context: params.lines[0],
                    });
                }
                return;
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
    },
};
module.exports = rule;
