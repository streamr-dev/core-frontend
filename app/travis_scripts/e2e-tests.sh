#!/usr/bin/env bash

set -e

# Start the app first so we don't run out of memory for node.
npm run start:ci &

# Wait for Core
npx wait-on http://localhost:3333

$(dirname $0)/start-docker-env.sh

# Wait for e&e
npx wait-on http-get://localhost/api/v1/categories

npm run cypress

kill $(jobs -p) || true
