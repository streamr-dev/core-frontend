#!/usr/bin/env bash

$(dirname $0)/build-docker-env.sh
NODE_OPTIONS='--trace-warnings --trace-deprecation' npm test
