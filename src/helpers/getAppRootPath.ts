import appRoot from "app-root-path";
import path from "path";

/**
 * get app root path.
 *
 * FIXME: in development, install this package by symlink, so appRoot.path is not correct.
 * so, we need to get app root path from DEV_MODE_INFO.
 */
export function getAppRootPath(
  args:
    | {
        DEV_MODE_INFO: {
          relativePathFromPackageAppRoot: string;
        };
      }
    | undefined
): string | undefined {
  if (args?.DEV_MODE_INFO) {
    return path.join(
      appRoot.path,
      args.DEV_MODE_INFO.relativePathFromPackageAppRoot
    );
  }

  return appRoot.path;
}
