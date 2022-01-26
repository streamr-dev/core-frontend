#!/usr/bin/env bash
set -e
echo "Config Env Variables:"
echo $NODE_ENV
echo $PORT
echo $VERSION
echo $SENTRY_ENVIRONMENT
echo $BUNDLE_ANALYSIS
echo $REST_URL
echo $STREAMR_WS_URL
echo $PLATFORM_ORIGIN_URL
echo $STREAMR_URL
echo $PLATFORM_PUBLIC_PATH
echo $GOOGLE_ANALYTICS_ID
echo $STORYBOOK_BASE_PATH
echo $MARKETPLACE_CONTRACT_ADDRESS
echo $DATA_TOKEN_CONTRACT_ADDRESS
echo $DAI_TOKEN_CONTRACT_ADDRESS
echo $UNISWAP_ADAPTOR_CONTRACT_ADDRESS
echo $MAINNET_CHAIN_ID
echo $MAINNET_HTTP_PROVIDER
echo $SENTRY_DSN
echo $SENTRY_INDEXER_DSN
echo $LOGROCKET_SLUG
npm run build-index
npm run build
$(dirname $0)/build-storybook.sh

echo "Code Deploy setup"
mkdir -p $TRAVIS_BUILD_DIR/build
cp $TRAVIS_BUILD_DIR/app/dist/index.html $TRAVIS_BUILD_DIR/build
# Set .appspec in root
mv $TRAVIS_BUILD_DIR/.codedeploy/.appspec.yml $TRAVIS_BUILD_DIR/build/appspec.yml
# Copy bash scripts to be deployed in the tar
mv  $TRAVIS_BUILD_DIR/.codedeploy  $TRAVIS_BUILD_DIR/build/
tar -czvf $TRAVIS_BUILD_DIR/build/marketplace.tar -C  $TRAVIS_BUILD_DIR/build index.html appspec.yml .codedeploy
rm -rf $TRAVIS_BUILD_DIR/build/*.html
rm -rf $TRAVIS_BUILD_DIR/build/*.yml
rm -rf $TRAVIS_BUILD_DIR/build/.codedeploy/
