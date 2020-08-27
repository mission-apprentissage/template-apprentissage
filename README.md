# Template Apprentissage

## Organisation

## Start Stack

## Conteneurs Docker

#!/bin/bash
set -euo pipefail

# [LINUX / MAC] Go in container

docker exec -t -i template_app_server /bin/bash

# Browse files in container

docker exec flux_server bash -c 'ls'

## Tests

## Déploiement

## Debugger sous VSCode

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Docker - Server",
      "address": "127.0.0.1",
      "port": 9229,
      "localRoot": "${workspaceFolder}/server/src",
      "remoteRoot": "/app/src",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```
