export interface MarkdownLintRuleTraceTemplateHeadersConfig {
  templateFile: string;
  includedFiles: string[];
  excludedFiles?: string[];
}

/**
 * Asserts the config is MarkdownLintRuleTraceTemplateHeadersConfig
 * 
 * @param config The config of markdownlint-rule-trace-template-headers
 * @throws Error if the config is not MarkdownLintRuleTraceTemplateHeadersConfig
 * @todo Add more precise error message
 */
export function assertMarkdownLintRuleTraceTemplateHeadersConfig(
  config: any
): asserts config is MarkdownLintRuleTraceTemplateHeadersConfig {
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
}
