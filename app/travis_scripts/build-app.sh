#!/usr/bin/env bash
set -e
echo "Config Env Variables:"
echo $NODE_ENV
echo $PORT
echo $VERSION
echo $SENTRY_ENVIRONMENT
echo $BUNDLE_ANALYSIS
echo $PLATFORM_PUBLIC_PATH
echo $GOOGLE_ANALYTICS_ID
echo $STORYBOOK_BASE_PATH
echo $SENTRY_DSN
echo $SENTRY_INDEXER_DSN
echo $LOGROCKET_SLUG
npm run build-index
npm run build
