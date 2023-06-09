module.exports = {
  release: {
    branches: ["main"]
  },
  plugins: [
    // DON'T CHANGE THE ORDER OF THE FOLLOWING PLUGINS
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog", // added: for updating the changelog
    "@semantic-release/git", // added: for updating the version in the package.json
    "@semantic-release/github",
    "@semantic-release/npm",
  ]
}