#!/usr/bin/env bash

set -e

$(dirname $0)/start-docker-env.sh

npm run start:ci &

npx wait-on http://localhost:3333

npm run cypress

kill $(jobs -p) || true
