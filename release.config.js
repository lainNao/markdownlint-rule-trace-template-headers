module.exports = {
  release: {
    branches: ["main"],
  },
  plugins: [
    // DON'T CHANGE THE ORDER OF THE FOLLOWING PLUGINS
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github",
  ],
};
