#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

bash /opt/mnaprojectname/tools/backup-mongodb.sh
bash /opt/mnaprojectname/cli.sh migrate
