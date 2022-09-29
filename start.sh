#!/bin/bash
set -a
source .env
set +a

if [ "$1" = "test" ]; then
  echo "Running \"npm test\""
  npm run test
elif [ "$1" = "db" ]; then
  echo "Running \"npm run migrate\""
  npm run migration:run
else
  echo "Executing \"dist/main.js\""
  npm run start
fi
