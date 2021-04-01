#!/bin/bash

set -e

## Get Streamr Docker dev
git clone --depth 1 https://github.com/streamr-dev/streamr-docker-dev.git "$GITHUB_WORKSPACE/streamr-docker-dev"

## Script for preparing smoke test
sudo ifconfig docker0 10.200.10.1/24

## Switch out image for local one
sed -i "s#$OWNER/$IMAGE_NAME:dev#$OWNER/$IMAGE_NAME:local#g" "$GITHUB_WORKSPACE/streamr-docker-dev/docker-compose.yml"

## Start up services needed
"$GITHUB_WORKSPACE/streamr-docker-dev/streamr-docker-dev/bin.sh" start --wait

## Wait for the service to come online and test
wait_time=10;
for (( i=0; i < 5; i=i+1 )); do
    if ! curl -s http://localhost/core/; then
        echo "Attempting to connect to Platform, retrying in $wait_time seconds"
        sleep $wait_time
        wait_time=$(( 2*wait_time ))
    else
        exit 0
    fi
done
exit 1
