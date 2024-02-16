/**
 * JS binding to NAPI quiche dynamic library.
 * This code was derived from the auto-generated binding and declaration
 * files provided by napi-rs.
 */
import process from 'process';
import path from 'path';

interface Exec {
  test(): boolean;
}

const projectRoot = path.join(__dirname, '../../');
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
 * For desktop we only support win32, darwin and linux.
 * Mobile OS support is pending.
 */
switch (process.platform) {
  case 'win32':
    switch (process.arch) {
      case 'x64':
        nativeBinding = requireBinding(['win32-x64']);
        break;
      case 'ia32':
        nativeBinding = requireBinding(['win32-ia32']);
        break;
      case 'arm64':
        nativeBinding = requireBinding(['win32-arm64']);
        break;
      default:
        throw new Error(`Unsupported architecture on Windows: ${process.arch}`);
    }
    break;
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
