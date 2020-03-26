#!/bin/bash

set -e

if [ ! -z VAULT_SECRETS ]; then

  KUBE_TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
  VAULT_TOKEN=$(curl -s -X POST -d '{"jwt": "'"$KUBE_TOKEN"'", "role": "graphql"}' https://vault.prod.chorus1.net:8200/v1/auth/kubernetes/login | jq .auth.client_token -r)
  SECRETS_JSON=$(curl -s https://vault.prod.chorus1.net:8200/v1/secret/data/app/graphql -H "X-Vault-Token: $VAULT_TOKEN")
  IFS=',' read -r -a ARR <<< "$VAULT_SECRETS"

  for i in "${ARR[@]}"; do export $i=$(echo $SECRETS_JSON | jq .data.data[\"$i\"] -r); done

fi;

echo "Launching ${@}..."

exec "$@"
