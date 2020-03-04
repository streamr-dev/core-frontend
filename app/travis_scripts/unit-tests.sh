#!/usr/bin/env bash

set -e

$(dirname $0)/start-docker-env.sh
npm test -- --maxWorkers=2
