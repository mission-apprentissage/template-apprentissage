#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "/opt/mna/data/ssl/privkey.pem" ]; then
  cd "${SCRIPT_DIR}"
    docker-compose stop reverse_proxy ftp

    docker build --tag flux_certbot certbot/
    docker run --rm --name flux_certbot \
      -p 80:5000 \
      -v /opt/mna/data/certbot:/etc/letsencrypt \
      -v /opt/mna/data/ssl:/ssl \
      flux_certbot "$@"

    docker-compose up --no-deps -d --build reverse_proxy
  cd -
else
  echo "SSL certificate already generated"
fi
