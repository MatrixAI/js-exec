/**
 * JS binding to NAPI uapi.
 * This code was derived from the auto-generated binding and declaration
 * files provided by napi-rs.
 */
import process from 'node:process';
import path from 'node:path';
import url from 'node:url';
import Module from 'node:module';

const require = Module.createRequire(import.meta.url);
const projectPath = path.dirname(
  path.dirname(url.fileURLToPath(import.meta.url)),
);
const prebuildPath = path.join(projectPath, 'prebuild');

interface Exec {
  /**
   * This calls the provided command with the provided arguments. The env variable are also provided as a
   * `Record<string, string>`. If the call fails in any way then it just throws the error code 'Error('number')`.
   * The most common would be an `ENOENT` in the form of `Error('2')`.
   *
   * This will replace the current process with the provided cmd. From the callers perspective this will seem really odd
   * and never return. The call can not return so and code after it is unreachable, hence the `never` return type. So
   * treat this function as a termination of the process, much like a `process.exit()` call.
   *
   * The exec'ed program will assume the current environment while adding the environment variables set by `env` to it.
   *
   * @param cmd - the command to call, this can be anything in the PATH or a specific file
   * @param argv - The args to be passed to the command
   * @param envp - env variables that you want to provide.
   */
  execvp(cmd: string, argv: Array<string>, envp: Record<string, string>): never;
}

/**
 * Try require on all prebuild targets first, then
 * try require on all npm targets second.
 */
function requireBinding(targets: Array<string>): Exec {
  const prebuildTargets = targets.map((target) =>
    path.join(prebuildPath, `exec-${target}.node`),
  );
  for (const prebuildTarget of prebuildTargets) {
    try {
      return require(prebuildTarget);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
    try {
      return require(url.pathToFileURL(prebuildTarget).href);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
  const npmTargets = targets.map((target) => `@matrixai/exec-${target}`);
  for (const npmTarget of npmTargets) {
    try {
      return require(npmTarget);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
    try {
      return require(url.pathToFileURL(npmTarget).href);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
  throw new Error(
    `Failed requiring possible native bindings: ${prebuildTargets.concat(
      npmTargets,
    )}`,
  );
}

let nativeBinding: Exec;

/**
 * For desktop we only support darwin and linux.
 * Mobile OS support is pending.
 */
switch (process.platform) {
  case 'darwin':
    switch (process.arch) {
      case 'x64':
        nativeBinding = requireBinding([
          'darwin-x64',
          'darwin-x64+arm64',
          'darwin-arm64+x64',
          'darwin-universal',
        ]);
        break;
      case 'arm64':
        nativeBinding = requireBinding([
          'darwin-arm64',
          'darwin-arm64+x64',
          'darwin-x64+arm64',
          'darwin-universal',
        ]);
        break;
      default:
        throw new Error(`Unsupported architecture on macOS: ${process.arch}`);
    }
    break;
  case 'linux':
    switch (process.arch) {
      case 'x64':
        nativeBinding = requireBinding(['linux-x64']);
        break;
      case 'arm64':
        nativeBinding = requireBinding(['linux-arm64']);
        break;
      case 'arm':
        nativeBinding = requireBinding(['linux-arm']);
        break;
      default:
        throw new Error(`Unsupported architecture on Linux: ${process.arch}`);
    }
    break;
  default:
    throw new Error(
      `Unsupported OS: ${process.platform}, architecture: ${process.arch}`,
    );
}

export default nativeBinding;

export type { Exec };
