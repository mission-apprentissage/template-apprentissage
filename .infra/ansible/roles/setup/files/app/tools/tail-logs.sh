#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly PROJECT_DIR="/opt/mnaprojectname/repository"

function tail_logs() {
    echo "Rechargement des conteneurs ..."

    cd "${PROJECT_DIR}"
    /usr/local/bin/docker-compose \
      -f "${PROJECT_DIR}/docker-compose.yml" \
      -f "/opt/mnaprojectname/.overrides/docker-compose.common.yml" \
      -f "/opt/mnaprojectname/.overrides/docker-compose.env.yml" \
      --project-name mnaprojectname \
      logs "$@"
    cd -
}

tail_logs "$@"
