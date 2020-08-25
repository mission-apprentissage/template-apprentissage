#!/bin/bash
set -euo pipefail

# Restart App on Develop / Master
bash /opt/mna/start-app.sh develop
bash /opt/mna/start-app.sh master

