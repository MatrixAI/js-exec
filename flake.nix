{
  inputs = {
    nixpkgs-matrix = {
      type = "indirect";
      id = "nixpkgs-matrix";
      inputs.nixpkgs.url =
        "github:NixOS/nixpkgs?rev=ea5234e7073d5f44728c499192544a84244bf35a";
    };
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs-matrix, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs-matrix.legacyPackages.${system};
        shell = { ci ? false }:
          with pkgs;
          mkShell {
            nativeBuildInputs = [
              nodejs_20
              shellcheck
              gitAndTools.gh
              rustc
              cargo
              cmake
              rustPlatform.bindgenHook
            ];
            NIX_DONT_SET_RPATH = true;
            NIX_NO_SELF_RPATH = true;
            RUST_SRC_PATH = "${rustPlatform.rustLibSrc}";
            shellHook = ''
              echo "Entering $(npm pkg get name)"
              set -o allexport
              . ./.env
              set +o allexport
              set -v
              ${lib.optionalString ci ''
                set -o errexit
                set -o nounset
                set -o pipefail
                shopt -s inherit_errexit
              ''}
              mkdir --parents "$(pwd)/tmp"
              export PATH="$(pwd)/dist/bin:$(npm root)/.bin:$PATH"
              npm install --ignore-scripts
              set +v
            '';
          };
      in {
        devShells = {
          default = shell { ci = false; };
          ci = shell { ci = true; };
        };
      });
}
