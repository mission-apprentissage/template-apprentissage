#!/usr/bin/env bash
set -euo pipefail

readonly TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CURRENT_GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

cd "${TEST_DIR}"

if [ "${1:-''}" == "--clean" ]; then
    vagrant halt
    vagrant destroy --force
fi

ansible-galaxy install geerlingguy.docker
vagrant up --no-provision
ANSIBLE_PLAYBOOK="setup" GIT_REVISION="${CURRENT_GIT_BRANCH}" vagrant provision
cd -

echo "You can check instance with command 'vagrant ssh' or stop the vm with 'vagrant halt'"
