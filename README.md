# js-quic

staging: [![pipeline status](https://gitlab.com/MatrixAI/open-source/js-exec/badges/staging/pipeline.svg)](https://gitlab.com/MatrixAI/open-source/js-exec/commits/staging)
master: [![pipeline status](https://gitlab.com/MatrixAI/open-source/js-exec/badges/master/pipeline.svg)](https://gitlab.com/MatrixAI/open-source/js-exec/commits/master)

This is a simple native binding for running execpv

## Installation

```sh
npm install --save @matrixai/quic
```

## Usage

See the example executables in `/src/bin`.

## Development

Run `nix develop`, and once you're inside, you can use:

```sh
# install (or reinstall packages from package.json)
npm install
# build the native objects
npm run prebuild
# build the dist and native objects
npm run build
# run the repl (this allows you to import from ./src)
npm run ts-node
# run the tests
npm run test
# lint the source code
npm run lint
# automatically fix the source
npm run lintfix
```

### Cargo/Rust targets

Cargo is a cross-compiler. The target structure looks like this:

```
<arch><sub>-<vendor>-<sys>-<abi>
```

For example:

```
x86_64-unknown-linux-gnu
x86_64-pc-windows-msvc
aarch64-apple-darwin
x86_64-apple-darwin
```

The available target list is in `rustc --print target-list`.

## Benchmarks

```sh
npm run bench
```

View benchmarks here: https://github.com/MatrixAI/js-quic/blob/master/benches/results with https://raw.githack.com/

### Docs Generation

```sh
npm run docs
```

See the docs at: https://matrixai.github.io/js-quic/

### Publishing

Publishing is handled automatically by the staging pipeline.

Prerelease:

```sh
# npm login
npm version prepatch --preid alpha # premajor/preminor/prepatch
git push --follow-tags
```

Release:

```sh
# npm login
npm version patch # major/minor/patch
git push --follow-tags
```

Manually:

```sh
# npm login
npm version patch # major/minor/patch
npm run build
npm publish --access public
git push
git push --tags
```
