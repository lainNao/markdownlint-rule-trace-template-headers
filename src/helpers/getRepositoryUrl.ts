import packageJson from "../../package.json";

export function getRepositoryUrl(): string {
  return packageJson.repository.url;
}
