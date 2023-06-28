type LoggerFunction = (...args: unknown[]) => void;

const greenStringSetting = "\x1b[32m%s\x1b[0m";

export const makeConsoleLogger = ({
  enabled,
  color,
}: {
  enabled: boolean;
  color?: string;
}): LoggerFunction => {
  return (...args: unknown[]) => {
    if (!enabled) {
      return;
    }
    const stringifiedArgs = args.map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }
      return JSON.stringify(arg, null, 2);
    }).join("\r\n");
    console.log(color ?? greenStringSetting, stringifiedArgs);
  };
};
