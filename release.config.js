module.exports = {
  release: {
    branches: ["main"],
  },
  plugins: [
    // DON'T CHANGE THE ORDER OF THE FOLLOWING PLUGINS
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog", // added: for updating the changelog
    "@semantic-release/npm",
    "@semantic-release/git", 
    [
      "@semantic-release/git", // added: for updating the version in the package.json
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(release): set `package.json` to ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
