#!/usr/bin/env bash

set -e

npm run build

$(dirname $0)/start-docker-env.sh

npx node-static -p 3333 -a 0.0.0.0 ./dist

npx wait-on http://localhost:3333

npm run cypress

kill $(jobs -p) || true
