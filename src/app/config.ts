import { isArray } from "../helpers/isArray";

export type MarkdownLintRuleTraceTemplateHeadersSetting = {
  templateFile: string;
  includedFiles: string[];
  excludedFiles?: string[];
};

export type MarkdownLintRuleTraceTemplateHeadersConfigRoot = {
  IS_DEV: boolean;
  settings: MarkdownLintRuleTraceTemplateHeadersSetting[];
};

/**
 * Asserts the config is MarkdownLintRuleTraceTemplateHeadersConfig
 *
 * @param config The config of markdownlint-rule-trace-template-headers
 * @throws Error if the config is not MarkdownLintRuleTraceTemplateHeadersConfig
 * @todo Add more precise error message
 */
export function assertMarkdownLintRuleTraceTemplateHeadersConfigRoot(
  configRoot: any
): asserts configRoot is MarkdownLintRuleTraceTemplateHeadersConfigRoot {
  // validate config is not falsy
  if (!configRoot) {
    throw new Error("configRoot does not set.");
  }

  // validate configRoot.settings is array
  const settings = configRoot?.settings;
  if (!isArray(settings)) {
    throw new Error("configRoot.settings is not array.");
  }

  // validate configRoot element is MarkdownLintRuleTraceTemplateHeadersConfig
  try {
    settings.forEach((config) => {
      assertMarkdownLintRuleTraceTemplateHeadersSetting(config);
    });
  } catch (e) {
    throw e;
  }
}

export function assertMarkdownLintRuleTraceTemplateHeadersSetting(
  setting: any
): asserts setting is MarkdownLintRuleTraceTemplateHeadersSetting {
  if (!setting.templateFile) {
    throw new Error("setting.templateFile should be set.");
  }

  if (!setting.includedFiles) {
    throw new Error("setting.includedFiles should be set.");
  }

  if (!isArray(setting.includedFiles)) {
    throw new Error("setting.includedFiles should be array.");
  }

  if (setting.excludedFiles && !isArray(setting.excludedFiles)) {
    throw new Error("setting.excludedFiles should be array or undefined.");
  }
}
