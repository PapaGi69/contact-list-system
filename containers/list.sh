#!/bin/bash -eu

NO_LOCK_REQUIRED=false

. ./.env
. ./common.sh

dots=""
maxRetryCount=50

HOST=${DOCKER_PORT_2375_TCP_ADDR:-"localhost"}

echo "${bold}******************************************************"
echo "Multi-Asset Wallet - Blockchain Enabled Banking Service"
echo "******************************************************${normal}"

while [ "$(docker inspect --format='{{json .State.Health.Status}}' kafka)" != "\"healthy\"" ] && [ ${#dots} -le ${maxRetryCount} ]
    do
      dots=$dots"."
      printf "Kafka is starting, please wait$dots\\r"
      sleep 10
done

echo "----------------------------------"
echo "List endpoints and services"
echo "----------------------------------"

echo "Kafka UI address                              : http://${HOST}:8080"
echo "PG Admin UI address                           : http://${HOST}:5050"

echo ""
echo "For more information on the endpoints and services, refer to README.md in the installation directory."