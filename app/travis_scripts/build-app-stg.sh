#!/usr/bin/env bash
echo "Config Env Variables:"
echo $NODE_ENV
echo $PORT
echo $STREAMR_API_URL
echo $STREAMR_WS_URL
echo $STREAMR_URL
echo $MARKETPLACE_URL_ORIGIN
echo $MARKETPLACE_BASE_URL
echo $GOOGLE_ANALYTICS_ID
echo $PLATFORM_ORIGIN_URL
echo $PLATFORM_BASE_PATH
echo $STORYBOOK_BASE_PATH
echo $API_EXPLORER_BASE_PATH
npm run build
$(dirname $0)/build-storybook.sh
$(dirname $0)/build-explorer.sh
