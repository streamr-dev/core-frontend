#!/usr/bin/env bash

trap "killall background" EXIT # clean up background jobs

##
## Pulls down streamr-docker-dev and starts an engine-and-editor instance + associated services ##
##

source "${BASH_SOURCE%/*}/utils.sh"

cd $TRAVIS_BUILD_DIR
sudo /etc/init.d/mysql stop
sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
sudo ifconfig docker0 10.200.10.1/24

git clone https://github.com/streamr-dev/streamr-docker-dev.git
streamr_docker_dev='streamr-docker-dev/streamr-docker-dev/bin.sh'

# start everything except eth watcher
$streamr_docker_dev start 5

$streamr_docker_dev log -f &

# wait for E&E to come up
while true; do http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/streamr-core/api/v1/users/me); if [ $http_code = 401 ]; then echo "EE up and running"; break; else echo "EE not receiving connections"; sleep 5s; fi; done

# wait for data-api to come up
while true; do http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8890/); if [ $http_code = 404 ]; then echo "Data-api up and running"; break; else echo "Data API not receiving connections"; sleep 5s; fi; done

# check that nginx is routing /api requests to E&E
while true; do http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/v1/users/me); if [ $http_code = 401 ]; then echo "nginx routing requests to EE"; break; else echo "nginx not routing requests correctly"; sleep 5s; fi; done
