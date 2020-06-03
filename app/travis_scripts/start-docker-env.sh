#!/usr/bin/env bash
set -e
##
## Pulls down streamr-docker-dev and starts the stack except the frontend ##
##

source "${BASH_SOURCE%/*}/utils.sh"

cd "$TRAVIS_BUILD_DIR" || exit 1
sudo /etc/init.d/mysql stop
sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
sudo ifconfig docker0 10.200.10.1/24

git clone https://github.com/streamr-dev/streamr-docker-dev.git
streamr_docker_dev='streamr-docker-dev/streamr-docker-dev/bin.sh'

# start everything except the frontend
$streamr_docker_dev start --except platform --wait

# temporary hack to get around broker initialization timing bug
$streamr_docker_dev restart broker-node-no-storage-1 broker-node-no-storage-2 broker-node-storage-1 --wait
