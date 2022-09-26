#!/bin/bash -u

NO_LOCK_REQUIRED=false

. ./.env
. ./common.sh

echo "${bold}******************************************************"
echo "Multi-Asset Wallet - Blockchain Enabled Banking Service"
echo "******************************************************${normal}"
echo "Stop and remove network..."
echo "------------------------------------------------------"

docker-compose -f kafka/docker-compose.yml down -v
docker-compose -f kafka/docker-compose.yml rm -sfv

docker-compose -f postgresql/docker-compose.yml down -v
docker-compose -f postgresql/docker-compose.yml rm -sfv

rm ${LOCK_FILE}
echo "Lock file ${LOCK_FILE} removed"