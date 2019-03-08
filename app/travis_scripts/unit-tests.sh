#!/usr/bin/env bash

$(dirname $0)/build-docker.sh
npm run test
