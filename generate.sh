#!/usr/bin/env bash
set -euo pipefail

readonly PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly TARGET_DIR="build/"

function build_project(){
  mkdir -p "${TARGET_DIR}"
  rsync -av --progress "${PROJECT_DIR}/" "${TARGET_DIR}" \
    --exclude build \
    --exclude .git \
    --exclude README.md \
    --exclude generate.sh \
    --exclude replace_pattern_in_files \
    --exclude server/node_modules \
    --exclude ui/node_modules
}

function replace_pattern_in_files() {
  local pattern="${1}"
  local project_name="${2}"

  find "${TARGET_DIR}" -type f -exec sed -i "s#${pattern}#${project_name}#g" {} \;
}


build_project
mv "${TARGET_DIR}/_README.md" "${TARGET_DIR}/README.md"
mv "${TARGET_DIR}/.infra/README_infra.md" "${TARGET_DIR}/.infra/README.md"
yarn --cwd replace_pattern_in_files install
node replace_pattern_in_files/index.js

echo ""
echo "Projet généré dans ${TARGET_DIR}"
