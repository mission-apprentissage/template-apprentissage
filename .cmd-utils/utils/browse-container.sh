#!/bin/bash
set -euo pipefail

# [LINUX / MAC] Go in container 
docker exec -t -i template_app_server /bin/bash

# Browse files in container
docker exec flux_server bash -c 'ls'
