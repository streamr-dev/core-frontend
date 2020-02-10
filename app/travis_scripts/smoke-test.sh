 #!/bin/bash

set -e

## Script for preparing smoke test
sudo ifconfig docker0 10.200.10.1/24
## Get Streamr Docker dev
mkdir "$TRAVIS_BUILD_DIR/streamr-docker-dev"
git clone https://github.com/streamr-dev/streamr-docker-dev.git "$TRAVIS_BUILD_DIR/streamr-docker-dev"
## Switch out image for local one
sed -i "s#$OWNER/$IMAGE_NAME:dev#$OWNER/$IMAGE_NAME:local#g" "$TRAVIS_BUILD_DIR/streamr-docker-dev/docker-compose.override.yml"

## Start up services needed
"$TRAVIS_BUILD_DIR/streamr-docker-dev/streamr-docker-dev/bin.sh" start 5
"$TRAVIS_BUILD_DIR/streamr-docker-dev/streamr-docker-dev/bin.sh" start platform

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
