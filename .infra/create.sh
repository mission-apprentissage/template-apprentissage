#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ENV_NAME="${1:?"Please provide an environment name (eg. staging)"}"; shift;
readonly AZURE_ENV_NAME="mna-template-${ENV_NAME}";
readonly AZURE_SECURITY_GROUP="${AZURE_ENV_NAME}NSG"
readonly AZURE_RESOURCE_GROUP="${AZURE_ENV_NAME}"
readonly AZURE_LOCATION="francecentral"
AZURE_DNS_PREFIX="${AZURE_ENV_NAME}"
AZURE_VM_SIZE="1"
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --dns) AZURE_DNS_PREFIX="$2"; shift ;;
        --vm-size) AZURE_VM_SIZE="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

function create_vm() {
  echo "1. Creating ressource group ${AZURE_RESOURCE_GROUP}..."
  az group create --name "${AZURE_RESOURCE_GROUP}" --location "${AZURE_LOCATION}"

  echo "2. Creating VM UbuntuLTS..."
  az vm create \
      --image UbuntuLTS  \
      --name "${AZURE_ENV_NAME}" \
      --resource-group "${AZURE_RESOURCE_GROUP}"  \
      --admin-username ansible  \
      --generate-ssh-keys \
      --size "Standard_DS${AZURE_VM_SIZE}_v2" \
      --public-ip-address-dns-name "${AZURE_DNS_PREFIX}"

  echo "3. Creating Network Rules..."
  az network nsg rule create \
      --nsg-name "${AZURE_SECURITY_GROUP}" \
      --resource-group "${AZURE_RESOURCE_GROUP}" \
      --name open-port-80 \
      --protocol tcp \
      --priority 100 \
      --destination-port-range 80

  az network nsg rule create \
      --nsg-name "${AZURE_SECURITY_GROUP}" \
      --resource-group "${AZURE_RESOURCE_GROUP}" \
      --name open-port-443 \
      --protocol tcp \
      --priority 150 \
      --destination-port-range 443

  az network nsg rule create \
      --nsg-name "${AZURE_SECURITY_GROUP}" \
      --resource-group "${AZURE_RESOURCE_GROUP}" \
      --name open-port-21 \
      --protocol tcp \
      --priority 200 \
      --destination-port-range 21

  az network nsg rule create \
      --nsg-name "${AZURE_SECURITY_GROUP}" \
      --resource-group "${AZURE_RESOURCE_GROUP}" \
      --name open-port-21100-21110 \
      --protocol tcp \
      --priority 300 \
      --destination-port-range 21100-21110
}

function add_env_ini() {
  cat << EOF >> "${SCRIPT_DIR}/ansible/env.ini"
[${ENV_NAME}]
$(az vm show -d -g "${AZURE_ENV_NAME}" -n "${AZURE_ENV_NAME}" --query publicIps -o tsv)
[${ENV_NAME}:vars]
dns_name=$(az vm show -d -g "${AZURE_ENV_NAME}" -n "${AZURE_ENV_NAME}" --query fqdns -o tsv)
update_sshd_config=true
git_revision=$(git rev-parse --abbrev-ref HEAD)

EOF
}

echo "-- Creating env ${AZURE_ENV_NAME} --"
create_vm
add_env_ini
echo "-- Env ${AZURE_ENV_NAME} successfully created ! --"
