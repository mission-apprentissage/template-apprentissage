#!/bin/bash
set -euo

readonly DNS_NAME="${1:?"Please provide a dns name (eg. mna-flux-staging.francecentral.cloudapp.azure.com)"}"; shift;
readonly SSL_OUTPUT_DIR="/ssl"

if [ ! -d "${SSL_OUTPUT_DIR}" ]; then
    echo "You must mount directory on path ${SSL_OUTPUT_DIR}"
    exit 1
fi

function start_http_server_for_acme_challenge(){
  mkdir -p /var/www
  serve /var/www &
}

function generate_certificate(){
  echo "Generating certificate for domain ${DNS_NAME}..."
  certbot certonly \
    --email mna.flux.devops@gmail.com \
    --agree-tos \
    --non-interactive \
    --webroot \
    --webroot-path /var/www \
    --domain "${DNS_NAME}"

  cp "/etc/letsencrypt/live/${DNS_NAME}/fullchain.pem" "${SSL_OUTPUT_DIR}"
  cp "/etc/letsencrypt/live/${DNS_NAME}/privkey.pem" "${SSL_OUTPUT_DIR}"
}

function generate_self_signed_certificate(){
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "${SSL_OUTPUT_DIR}/privkey.pem" \
    -out "${SSL_OUTPUT_DIR}/fullchain.pem" \
    -subj "/C=FR/O=Mission Apprentissage/CN=Root"
}

function download_tls_config_for_nginx(){
  echo "Downloading recommended nginx conf..."
  curl "https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf" \
    -o "${SSL_OUTPUT_DIR}/options-ssl-nginx.conf"

  curl "https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem" -o "${SSL_OUTPUT_DIR}/ssl-dhparams.pem"
}

download_tls_config_for_nginx

if [ "${DNS_NAME}" == "localhost" ] ; then
  generate_self_signed_certificate
else
  start_http_server_for_acme_challenge
  generate_certificate
fi
