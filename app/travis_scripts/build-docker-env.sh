#!/usr/bin/env bash
set -e
trap "killall background" EXIT # clean up background jobs

##
## Pulls down streamr-docker-dev and starts an engine-and-editor instance + associated services ##
##

source "${BASH_SOURCE%/*}/utils.sh"

cd "$TRAVIS_BUILD_DIR" || exit 1
sudo /etc/init.d/mysql stop
sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
sudo ifconfig docker0 10.200.10.1/24

git clone https://github.com/streamr-dev/streamr-docker-dev.git
streamr_docker_dev='streamr-docker-dev/streamr-docker-dev/bin.sh'

# start everything except eth watcher
$streamr_docker_dev start 5
#$streamr_docker_dev log -f &

RETRIES=30;
RETRY_DELAY=5s;

# wait for E&E to come up
waitFor $RETRIES $RETRY_DELAY checkHTTP "engine-and-editor" 302 http://localhost/api/v1/users/me;
if [ $? -eq 1 ] ; then
	echo "engine-and-editor never up";
	$streamr_docker_dev ps;
	exit 1;
fi

# script automates connecting and then disconnecting from websocket
BROKER_NODE_CHECK="${BASH_SOURCE%/*}/broker-node-check.exp"

# wait for brokers to come up
waitFor $RETRIES $RETRY_DELAY expect "$BROKER_NODE_CHECK"
if [ $? -eq 1 ] ; then
	echo "broker-node never up";
	$streamr_docker_dev ps;
	exit 1;
fi
