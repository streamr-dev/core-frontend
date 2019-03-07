#!/usr/bin/env bash

(
    cd $TRAVIS_BUILD_DIR
    sudo /etc/init.d/mysql stop
    sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
    git clone https://github.com/streamr-dev/streamr-docker-dev.git
    sudo ifconfig docker0 10.200.10.1/24
    docker pull streamr/engine-and-editor:dev && docker pull streamr/ethereum-watcher:latest; docker pull streamr/cloud-broker:stg; docker pull streamr/data-api:latest; streamr-docker-dev start 1 && sleep 60 && streamr-docker-dev start ethereum-watcher
    while true; do http_code=$(curl -s -o /dev/null -I -w "%{http_code}" http://localhost:8081/streamr-core/login/auth); if [ $http_code = 200 ]; then echo "EE up and running"; break; else echo "EE not receiving connections"; sleep 5s; fi; done
    streamr-docker-dev/streamr-docker-dev/bin.sh restart data-api
    while true; do http_code=$(curl -s -o /dev/null -I -w "%{http_code}" http://localhost:8890/); if [ $http_code = 404 ]; then echo "Data-api up and running"; break; else echo "Data API not receiving connections"; sleep 5s; fi; done
)

npm run test-local
docker logs streamr_dev_data-api --tail 500
docker logs streamr_dev_engine-and-editor --tail 500
#npm test
