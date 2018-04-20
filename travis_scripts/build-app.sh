#!/usr/bin/env bash
if [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
npm run build
fi
