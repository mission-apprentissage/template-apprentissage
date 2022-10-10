#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "/opt/mnaprojectname/data/ssl/privkey.pem" ]; then
  cd "${SCRIPT_DIR}"
    docker build --tag mnaprojectname_certbot certbot/
    docker run --rm --name mnaprojectname_certbot \
      -p 80:3000 \
      -v /opt/mnaprojectname/data/certbot:/etc/letsencrypt \
      -v /opt/mnaprojectname/data/ssl:/ssl \
      mnaprojectname_certbot generate "$@"
  cd -
else
  echo "Certificat SSL déja généré"
fi
