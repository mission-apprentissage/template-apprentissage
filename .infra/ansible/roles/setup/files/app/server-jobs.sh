#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec mnaprojectname_server yarn --silent jobs
