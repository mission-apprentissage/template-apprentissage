#!/usr/bin/env bash
set -euo pipefail

readonly ANSIBLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/ansible"
readonly ENV_FILTER=${1:?"Please provide an environment filter (eg. staging or production)"}
shift

echo "Deploying on environments ${ENV_FILTER}..."
cd "${ANSIBLE_DIR}"
ansible-galaxy install geerlingguy.docker
ansible-playbook -i env.ini --limit "${ENV_FILTER}" --ask-become-pass setup.yml  $@
cd -

