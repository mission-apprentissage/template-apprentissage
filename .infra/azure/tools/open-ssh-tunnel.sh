#!/usr/bin/env bash
set -euo pipefail

readonly ANSIBLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../ansible"

function help() {
  echo "Usage: `basename $0` <envName> <port> [<remote user name>]"
  echo "Eg: `basename $0` staging 27018"
  echo "    `basename $0` staging 27018 myRemoteUserName"
  exit 0
}

function open_ssh_tunnel() {
  local env_name="${1}"
  local port="${2}"
  local remote_user="${3:-$(whoami)}"
  local env_ip
  env_ip="$(cat "${ANSIBLE_DIR}/env.ini" | grep "\[${env_name}\]" -A 1 | tail -1)"

  ssh -L "${port}:127.0.0.1:${port}" "${remote_user}@${env_ip}"
}

trap help EXIT HUP INT QUIT PIPE TERM
open_ssh_tunnel "$@"


