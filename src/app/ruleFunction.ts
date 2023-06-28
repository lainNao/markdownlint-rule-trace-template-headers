import fs from "fs";
import path from "path";

import { Rule as MarkdownLintRule } from "markdownlint";
import { assertMarkdownLintRuleTraceTemplateHeadersConfig } from "./config";
import { isPathMatchArray } from "../helpers/isPathMatch";
import { isHeaderLine } from "../helpers/isHeaderLine";
import { getAppRootPath } from "../helpers/getAppRootPath";

// TODO: assert〜の中身も全部onErrorにしたい
// TODO: check if template file existsの上も全部バリデーションだな。バリデーションにも種類があるのか、、
// 型ガード、値のバリデーション（ファイルの存在バリデーション）、本来やりたいドメインバリデーション（このプラグインのコア部分）。そう考えればいいかな？でもできればインターフェースは同じにしたい。このmainが何をするかの関心事だから、それら3関数の中ではonErrorは発火させない感じ？できるかな…。配列のはできない場合、単要素のバリデーションだけ作ってmainで回せば良い
export const ruleFunction: MarkdownLintRule["function"] = (
  params,
  onError
): void => {
  // Return if the config.markdownlint-rule-trace-template-headers is falsy.
  const config = params.config;
  try {
    assertMarkdownLintRuleTraceTemplateHeadersConfig(config);
  } catch (e) {
    console.error(e);
    return;
  }

  const appRootPath = getAppRootPath();

  // Return if the file is not match the glob pattern of params.config.filePattern
  const fileNameFromAppRoot = path.relative(appRootPath, params.name);
  const includedFiles = params.config.includedFiles;
  if (includedFiles && !isPathMatchArray(fileNameFromAppRoot, includedFiles)) {
    return;
  }

  // Return if the file is match the glob pattern of params.config.excludedFiles
  const excludedFiles = params.config.excludedFiles;
  if (excludedFiles && isPathMatchArray(fileNameFromAppRoot, excludedFiles)) {
    return;
  }

  const targetTemplateFile = path.join(appRootPath, params.config.templateFile);

  // check if template file exists
  if (!fs.existsSync(targetTemplateFile)) {
    onError({
      lineNumber: 1,
      detail: `Template file '${JSON.stringify(
        targetTemplateFile
      )}' does not exist. Please specify a valid template file.`,
      context: params.lines[0],
    });
    return;
  }

  // get template headers
  const templateHeaders: string[] = [];
  fs.readFileSync(targetTemplateFile, "utf8")
    .split(/\r?\n/)
    .forEach((line: string, index: number) => {
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
            targetTemplateFile
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
        targetTemplateFile
      )}' and current file have different headers count. Expected: ${
        templateHeaders.length
      }, given: ${foundedHeaders.length}`,
      context: params.lines[0],
    });
  }

  return;
};
