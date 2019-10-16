#!/usr/bin/env bash

set -e

$(dirname $0)/build-docker-env.sh
npm test
