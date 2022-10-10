#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

start_app() {
  bash /opt/mnaprojectname/start-app.sh "$(git --git-dir=/opt/mnaprojectname/repository/.git rev-parse --abbrev-ref HEAD)"
}

handle_error() {
  bash /opt/mnaprojectname/tools/send-to-slack.sh "[SSL] Unable to renew certificate"
  start_app
}
trap handle_error ERR

bash /opt/mnaprojectname/stop-app.sh mnaprojectname_reverse_proxy

cd "${SCRIPT_DIR}"
docker build --tag mnaprojectname_certbot certbot/
docker run --rm --name mnaprojectname_certbot \
  -p 80:3000 \
  -v /opt/mnaprojectname/data/certbot:/etc/letsencrypt \
  -v /opt/mnaprojectname/data/ssl:/ssl \
  mnaprojectname_certbot renew "$@"
cd -

start_app
bash /opt/mnaprojectname/tools/send-to-slack.sh "[SSL] Certificat has been renewed"
