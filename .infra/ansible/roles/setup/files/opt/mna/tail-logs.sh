#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/template"

function tail_logs() {
    echo "Reloading containers..."

    cd "${APP_DIR}"
    docker-compose  \
      -f /opt/mna/template/docker-compose.yml \
      -f /opt/mna/template/.infra/azure/docker-compose.azure.yml \
      --project-name template \
      logs "$@"
    cd -
}

tail_logs "$@"