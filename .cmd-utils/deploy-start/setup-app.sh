#!/bin/bash
set -euo pipefail

# Setup App on Env + User
bash /opt/mna/setup.sh staging --user <USER_XXXX>
bash /opt/mna/setup.sh prod

