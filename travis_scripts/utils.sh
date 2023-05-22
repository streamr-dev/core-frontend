#!/usr/bin/env bash
set -e
# Check url responds with expected http response code
# arguments: name expected_status url
# e.g. checkHTTP 'data-api' 404 http://localhost:8890/
checkHTTP() {
    name=$1;
    expected_status=$2;
    url=$3;
    http_code=$(curl -s -o /dev/null -I -w "%{http_code}" $url);
    if [ $http_code -eq $expected_status ]; then
        echo "$name up";
        return 0;
    else
        echo "$name not up. Expected: $expected_status. Got: $http_code from $url";
        return 1;
    fi;
}

# retry a command after a delay maxtries times
# arguments: maxtries delay (in seconds)
# e.g. waitFor 10 3 checkHTTP 'data-api' 404 http://localhost:8890/
waitFor() {
    maxtries=$1;
    delay=$2;
    shift;
    shift;
    exit_code=1
    for n in $(seq $maxtries); do
        if $@ ; then
            exit_code=0
            break;
        else
            echo "retry $n of $maxtries after $delay."
            sleep $delay;
        fi
    done
    return $exit_code;
}
