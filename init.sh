#!/usr/bin/env bash
set -euo pipefail

readonly PROJECT_NAME="${1:?"Veuillez donner un nom de projet"}"
readonly PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function replace_pattern_in_files() {
  local pattern="${1}"
  local project_name="${2}"

  find "${PROJECT_DIR}" -type f ! -path "*init.sh*" ! -path "*node_modules*" ! -path "*.git*" \
    -exec sed -i "s#${pattern}#${project_name}#g" {} \;
}

replace_pattern_in_files mnaprojectname "${PROJECT_NAME}"

rm "${PROJECT_DIR}/init.sh"
