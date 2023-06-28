import fs from "fs";
import path from "path";

import { Rule as MarkdownLintRule } from "markdownlint";
import { assertMarkdownLintRuleTraceTemplateHeadersConfigRoot } from "./config";
import { isPathMatchArray } from "../helpers/isPathMatch";
import { isHeaderLine } from "../helpers/isHeaderLine";
import { getAppRootPath } from "../helpers/getAppRootPath";
import { getMarkdownHeaderLines } from "../helpers/getMarkdownHeaderLines";
import { makeConsoleLogger } from "../helpers/makeConsoleLogger";

// TODO: assert〜の中身も全部onErrorにしたい
// TODO: check if template file existsの上も全部バリデーションだな。バリデーションにも種類があるのか、、
// 型ガード、値のバリデーション（ファイルの存在バリデーション）、本来やりたいドメインバリデーション（このプラグインのコア部分）。そう考えればいいかな？でもできればインターフェースは同じにしたい。このmainが何をするかの関心事だから、それら3関数の中ではonErrorは発火させない感じ？できるかな…。配列のはできない場合、単要素のバリデーションだけ作ってmainで回せば良い
export const ruleFunction: MarkdownLintRule["function"] = (
  { config, lines, name: fileName },
  onError
): void => {
  const consoleLog = makeConsoleLogger({ enabled: config.IS_DEV });

  consoleLog("markdownlint-rule-trace-template-headers: DEV MODE");

  // Return if the config.markdownlint-rule-trace-template-headers is falsy.
  try {
    assertMarkdownLintRuleTraceTemplateHeadersConfigRoot(config);
  } catch (e) {
    console.error(e);
    return;
  }

  try {
    const appRootPath = getAppRootPath(
      config.IS_DEV
        ? {
            DEV_MODE_INFO: {
              relativePathFromPackageAppRoot: "example",
            },
          }
        : undefined
    );
    if (!appRootPath) {
      consoleLog("No app root path.");
      return;
    }

    // get matched setting
    const matchedSetting = config.settings.find((setting) => {
      const fileNameFromAppRoot = path.relative(appRootPath, fileName);
      return (
        isPathMatchArray(fileNameFromAppRoot, setting.includedFiles) &&
        !isPathMatchArray(fileNameFromAppRoot, setting.excludedFiles ?? [])
      );
    });
    if (!matchedSetting) {
      consoleLog("No matched setting.", appRootPath);
      return;
    }

    const targetTemplateFile = path.join(
      appRootPath,
      matchedSetting.templateFile
    );

    // check if template file exists
    if (!fs.existsSync(targetTemplateFile)) {
      onError({
        lineNumber: 1,
        detail: `Template file '${JSON.stringify(
          targetTemplateFile
        )}' does not exist. Please specify a valid template file.`,
        context: lines[0],
      });
      return;
    }

    // get template headers
    const templateHeaders: string[] = getMarkdownHeaderLines({
      fileContent: fs.readFileSync(targetTemplateFile, "utf8"),
    });

    // check if headers are equal
    const foundedHeaders: string[] = [];
    lines.forEach((line, lineIndex) => {
      if (isHeaderLine(line)) {
        const currentHeaderLine = line;
        const expectedHeaderLine = templateHeaders[foundedHeaders.length];
        if (expectedHeaderLine !== currentHeaderLine) {
          onError({
            lineNumber: lineIndex + 1,
            detail: `Template file '${JSON.stringify(
              targetTemplateFile
            )}' and current file have different headers or different headers order. Expected: ${expectedHeaderLine}, given: ${line}`,
            context: lines[lineIndex],
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
        lineNumber: isFoundedLess ? lines.length : 1,
        detail: `Template file '${JSON.stringify(
          targetTemplateFile
        )}' and current file have different headers count. Expected: ${
          templateHeaders.length
        }, given: ${foundedHeaders.length}`,
        context: lines[0],
      });
    }

    return;
  } catch (e) {
    consoleLog(e);
  }
};
