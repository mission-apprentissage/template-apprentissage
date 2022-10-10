#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec -it mnaprojectname_mongodb mongo "{{ vault[env_type].MNAPROJECTNAME_MONGODB_URI }}" "$@"
