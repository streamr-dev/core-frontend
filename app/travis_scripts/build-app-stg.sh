#!/usr/bin/env bash
set -e
echo "Config Env Variables:"
echo $NODE_ENV
echo $PORT
echo $VERSION
echo $SENTRY_ENVIRONMENT
echo $BUNDLE_ANALYSIS
echo $STREAMR_API_URL
echo $STREAMR_WS_URL
echo $PLATFORM_ORIGIN_URL
echo $STREAMR_URL
echo $PLATFORM_PUBLIC_PATH
echo $GOOGLE_ANALYTICS_ID
echo $STORYBOOK_BASE_PATH
echo $MARKETPLACE_CONTRACT_ADDRESS
echo $TOKEN_CONTRACT_ADDRESS
echo $WEB3_REQUIRED_NETWORK_ID
echo $WEB3_PUBLIC_HTTP_PROVIDER
echo $WEB3_PUBLIC_WS_PROVIDER
echo $SENTRY_DSN
echo $LOGROCKET_SLUG
npm run build
$(dirname $0)/build-storybook.sh

echo "Code Deploy setup"
mkdir $TRAVIS_BUILD_DIR/build
cp $TRAVIS_BUILD_DIR/app/dist/index.html $TRAVIS_BUILD_DIR/build
# Set .appspec in root
mv $TRAVIS_BUILD_DIR/.codedeploy/.appspec.yml $TRAVIS_BUILD_DIR/build/appspec.yml
# Copy bash scripts to be deployed in the tar
mv  $TRAVIS_BUILD_DIR/.codedeploy  $TRAVIS_BUILD_DIR/build/
tar -czvf $TRAVIS_BUILD_DIR/build/marketplace.tar -C  $TRAVIS_BUILD_DIR/build index.html appspec.yml .codedeploy
rm -rf $TRAVIS_BUILD_DIR/build/*.html
rm -rf $TRAVIS_BUILD_DIR/build/*.yml
rm -rf $TRAVIS_BUILD_DIR/build/.codedeploy/