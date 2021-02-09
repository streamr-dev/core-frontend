#!/usr/bin/env bash
set -e
trap 'jobs -p | xargs kill' EXIT
##
## Pulls down streamr-docker-dev and starts the stack except the frontend ##
##

source "${BASH_SOURCE%/*}/utils.sh"

cd "$TRAVIS_BUILD_DIR" || exit 1
sudo /etc/init.d/mysql stop
sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
sudo ifconfig docker0 10.200.10.1/24

if [ ! -d streamr-docker-dev ]; then
    git clone https://github.com/streamr-dev/streamr-docker-dev.git
fi

streamr_docker_dev='streamr-docker-dev/streamr-docker-dev/bin.sh'

# start everything except the frontend
$streamr_docker_dev start --except platform &
$streamr_docker_dev log -f engine-and-editor &
$streamr_docker_dev wait
