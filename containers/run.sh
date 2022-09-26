#!/bin/bash -u

NO_LOCK_REQUIRED=true

. ./.env
. ./common.sh

echo "docker-compose.yml" > ${LOCK_FILE}

echo "${bold}******************************************************"
echo "Multi-Asset Wallet - Blockchain Enabled Banking Service"
echo "******************************************************${normal}"
echo "Start network"
echo "------------------------------------------------------"

echo "Starting network..."
docker-compose -f kafka/docker-compose.yml up --detach
docker-compose -f postgresql/docker-compose.yml up --detach

sleep 5

./list.sh