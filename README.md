# markdownlint-rule-trace-template-headers

A custom markdownlint rule that provides the functionality to check the headers of a Markdown file based on the headers of a template file, verifying the match and order of the headers.

This package is compatible with markdownlint-cli2 and not markdownlint-cli.

## Usage

### CLI

1. Install dependencies.

    ```shell
    npm install -D markdownlint-cli2 @lainNao/markdownlint-trace-template-headers
    ```

1. Create config file.

    ```shell
    touch .markdownlint-cli2.jsonc
    ```

1. Edit `.markdownlint-cli2.jsonc` .

    - if markdownlint-rule-trace-template-headers is v2 or higher

    ```jsonc
    {
      "customRules": [
        "markdownlint-rule-trace-template-headers"
      ],
      "config": {
        "markdownlint-rule-trace-template-headers": {
          "settings": [
            {
              "templateFile": "YOUR_TEMPLATE_FILE.md", // template headers file
              "includedFiles": ["*.md"], // files to lint
              "excludedFiles": [] // files to exclude
            },
            ...
          ]
        }
      }
    }
    ```

    - if markdownlint-rule-trace-template-headers is v1 or lower

    ```jsonc
    {
      "customRules": [
        "markdownlint-rule-trace-template-headers"
      ],
      "config": {
        "markdownlint-rule-trace-template-headers": {
          "templateFile": "YOUR_TEMPLATE_FILE.md", // template headers file
          "includedFiles": ["*.md"], // files to lint
          "excludedFiles": [] // files to exclude
        }
      }
    }
    ```

1. Run lint.

    ```shell
    npx markdownlint-cli2 SOME_MARKDOWN_FILE.md
    ```

### VSCode

1. Install `markdownlint` in your VSCode extensions marketplace.
1. Create and edit `.markdownlint-cli2.jsonc` like above.
1. Verify the lint rule works works in Editor.

## Other

To disable the rule, edit `.markdownlint-cli2.jsonc` .

```jsonc
{
  "customRules": [
    "markdownlint-rule-trace-template-headers"
  ],
  "config": {
    "markdownlint-rule-trace-template-headers": false    // change this value to falsy
  }
}
```

## TODO

- Support multiple templates, auto fix, or more info at onError.
- Improve CI/CD. Add auto tests and auto versioning, updating changelog, release scripts.
  - ~~Know semantic release usage...~~
    - stop using semantic-release
      - githubのセキュリティの設定を弱めないと自動でpackage.jsonのversionフィールドやCHANGELOG.mdにプッシュしてくれないっぽく、微妙な気がするので
  - comparison between other tools in table format
- Create CONTRIBUTION.md
- Config to select error/warn
