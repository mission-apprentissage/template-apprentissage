#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly DNS_NAME=${1:?"Merci de préciser le nom de domaine"}; shift;

start_reverse_proxy() {
  bash /opt/mnaprojectname/start-app.sh "$(git --git-dir=/opt/mnaprojectname/repository/.git rev-parse --abbrev-ref HEAD)" \
    --no-deps reverse_proxy
}

stop_reverse_proxy() {
  bash /opt/mnaprojectname/stop-app.sh mnaprojectname_reverse_proxy --no-deps reverse_proxy
}

renew_certificate() {
  cd "${SCRIPT_DIR}"
  docker build --tag mnaprojectname_certbot certbot/
  docker run --rm --name mnaprojectname_certbot \
    -p 80:5000 \
    -v /opt/mnaprojectname/data/certbot:/etc/letsencrypt \
    -v /opt/mnaprojectname/data/ssl:/ssl \
    mnaprojectname_certbot renew "${DNS_NAME}"
  cd -
}

handle_error() {
  bash /opt/mnaprojectname/tools/send-to-slack.sh "[SSL] Unable to renew certificate"
  start_reverse_proxy
}
trap handle_error ERR

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
stop_reverse_proxy
renew_certificate
start_reverse_proxy
bash /opt/mnaprojectname/tools/send-to-slack.sh "[SSL] Certificat has been renewed"
