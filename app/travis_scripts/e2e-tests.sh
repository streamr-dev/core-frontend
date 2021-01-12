#!/usr/bin/env bash

set -e

npm run build

$(dirname $0)/start-docker-env.sh

npx node-static -p 3333 -a 0.0.0.0 ./dist &

# Wait for Core
npx wait-on http://localhost:3333

# Wait for e&e
npx wait-on http-get://localhost/api/v1/categories

npm run cypress

kill $(jobs -p) || true
