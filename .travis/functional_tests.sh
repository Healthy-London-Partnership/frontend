#!/usr/bin/env bash

# Bail out on first error.
set -e

# Start the development server.
yarn run start &

# Pull the Cypress image.
docker pull cypress/included:3.2.0

# Poll until dev server is live.
until [ $(curl --write-out %{http_code} --silent --output /dev/null --fail http://127.0.0.1:3000) -eq 200 ]
do
  echo -e "\033[33mFailed to connect to dev server, retrying in 3 seconds.\033[0m"
  sleep 3
done
  docker run \
    --rm \
    -e CYPRESS_baseUrl=http://127.0.0.1:3000 \
    --network=host \
    -v $PWD/tests:/e2e \
    -w /e2e \
    cypress/included:3.2.0
