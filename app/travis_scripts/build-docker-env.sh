#!/usr/bin/env bash

##
## Pulls down streamr-docker-dev and starts an engine-and-editor instance + associated services ##
##

cd $TRAVIS_BUILD_DIR
sudo /etc/init.d/mysql stop
sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
sudo ifconfig docker0 10.200.10.1/24

git clone https://github.com/streamr-dev/streamr-docker-dev.git
# start everything except eth watcher
streamr-docker-dev/streamr-docker-dev/bin.sh start 5
# wait for e&e to be up
while true; do http_code=$(curl -s -o /dev/null -I -w "%{http_code}" http://localhost:8081/streamr-core/login/auth); if [ $http_code = 200 ]; then echo "EE up and running"; break; else echo "EE not receiving connections"; docker logs streamr_dev_engine-and-editor; sleep 5s; fi; done
# data-api sometimes fails to boot properly (??!) if services start in wrong order
streamr-docker-dev/streamr-docker-dev/bin.sh restart data-api # let's restart it for good measure (?!)
# wait for data-api to be up
while true; do http_code=$(curl -s -o /dev/null -I -w "%{http_code}" http://localhost:8890/); if [ $http_code = 404 ]; then echo "Data-api up and running"; break; else echo "Data API not receiving connections"; sleep 5s; fi; done
# add a few more waits
sleep 10
