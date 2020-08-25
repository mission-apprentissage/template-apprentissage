#!/usr/bin/env bash
set -euo pipefail

readonly ANSIBLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/ansible"
readonly ENV_FILTER=${1:?"Please provide an environment filter (eg. staging or production,staging)"}
shift

echo "Deploying on environments ${ENV_FILTER}..."
cd "${ANSIBLE_DIR}"
ansible-playbook -i env.ini --limit "${ENV_FILTER}" deploy.yml  $@
cd -

