#!/bin/bash
if [ "$1" == "dev" ]; then
    echo "Tag dev"
    docker tag "$OWNER/$IMAGE_NAME:local" "$OWNER/$IMAGE_NAME:$1"
    ## Push dev
    docker push "$OWNER/$IMAGE_NAME:$1"
elif [ "$1" == "nightly" ]; then
    echo "Tag Nightly"
    nightly_build=nightly-$(date '+%Y-%m-%d')
    docker tag "$OWNER/$IMAGE_NAME:local" "$OWNER/$IMAGE_NAME:$nightly_build"
    docker tag "$OWNER/$IMAGE_NAME:local" "$OWNER/$IMAGE_NAME:nightly"
    ## Push Nightly
    docker push "$OWNER/$IMAGE_NAME:$nightly_build"
    docker push "$OWNER/$IMAGE_NAME:nightly"
elif [ "$1" == "production" ]; then
    echo "Tag Production latest/tag"
    docker tag "$OWNER/$IMAGE_NAME:local" "$OWNER/$IMAGE_NAME:$2"
    ## Push Production
    docker push "$OWNER/$IMAGE_NAME:$2"
fi
