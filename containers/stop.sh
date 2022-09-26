#!/bin/bash -u

NO_LOCK_REQUIRED=false

. ./.env
. ./common.sh

echo "${bold}******************************************************"
echo "Multi-Asset Wallet - Blockchain Enabled Banking Service"
echo "******************************************************${normal}"
echo "Stopping network"
echo "------------------------------------------------------"

docker-compose -f kafka/docker-compose.yml stop
docker-compose -f postgresql/docker-compose.yml stop
