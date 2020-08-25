#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/template"
readonly BRANCH=${1:?"Please provide a branch name (eg. master)"}

function update_repository() {
    echo "Updating repository..."

    cd "${APP_DIR}"
    git fetch
    git checkout "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
    cd -
}

function reload_containers() {
    echo "Reloading containers..."

    cd "${APP_DIR}"
    docker-compose \
      -f /opt/mna/template/docker-compose.yml \
      -f /opt/mna/template/.infra/azure/docker-compose.azure.yml \
      --project-name template \
      up -d --force-recreate --build --remove-orphans --renew-anon-volumes
    cd -
}

update_repository
reload_containers
