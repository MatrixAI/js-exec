/**
 * JS binding to NAPI uapi.
 * This code was derived from the auto-generated binding and declaration
 * files provided by napi-rs.
 */
import process from 'process';
import path from 'path';

interface Exec {
  /**
   * This calls the provided command with the provided arguments. The env variable are also provided in the format of
   * 'key=value'. If the call fails in any way then it just throws the error code 'Error('number')`. The most common
   * would be an `ENOENT` in the form of `Error('2')`.
   *
   * This will replace the current process with the provided cmd. From the callers perspective this will seem really odd
   * and never return. The call can not return so and code after it is unreachable, hence the `never` return type. So
   * treat this function as a termination of the process, much like a `process.exit()` call.
   *
   * The exec'ed program will not assume the environment of the current process. This can allow isolation but if you
   * want to have the current environment then you'll have to pass it in manually through the envp parameter.
   *
   * @param cmd - the command to call, this can be anything in the PATH or a specific file
   * @param argv - The args to be passed to the command
   * @param envp - env variables that you want to provide. These are formatted as an array of 'key=value'
   */
  execvpe(cmd: string, argv: Array<string>, envp: Array<string>): never;
}

const projectRoot = path.join(__dirname, '../');
const prebuildPath = path.join(projectRoot, 'prebuild');

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
  }
  const npmTargets = targets.map((target) => `@matrixai/quic-${target}`);
  for (const npmTarget of npmTargets) {
    try {
      return require(npmTarget);
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
        ]);
        break;
      case 'arm64':
        nativeBinding = requireBinding([
          'darwin-arm64',
          'darwin-arm64+x64',
          'darwin-x64+arm64',
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
