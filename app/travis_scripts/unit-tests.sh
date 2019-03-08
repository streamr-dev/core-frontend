#!/usr/bin/env bash

$(dirname $0)/build-docker-env.sh
npm run test
