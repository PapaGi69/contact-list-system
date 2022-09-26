#!/bin/bash -u

NO_LOCK_REQUIRED=false

. ./.env
. ./common.sh

echo "${bold}******************************************************"
echo "Multi-Asset Wallet - Blockchain Enabled Banking Service"
echo "******************************************************${normal}"
echo "Resuming network..."
echo "------------------------------------------------------"

echo "Starting docker containers..."

docker-compose -f kafka/docker-compose.yml start
docker-compose -f postgresql/docker-compose.yml start
