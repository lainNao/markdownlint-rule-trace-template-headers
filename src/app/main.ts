import { Rule as MarkdownLintRule } from "markdownlint";
import { ruleFunction } from "./ruleFunction";
import { getRepositoryUrl } from "../helpers/getRepositoryUrl";

export const rule: MarkdownLintRule = {
  names: ["markdownlint-rule-trace-template-headers"],
  description: "Rule that checks the headers is same to template",
  information: new URL(getRepositoryUrl()),
  tags: ["headers", "headings", "template"],
  function: ruleFunction,
};

