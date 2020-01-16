#!/usr/bin/env bash
set -e
npm run build-storybook -- --output-dir ./dist/${STORYBOOK_BASE_PATH}
