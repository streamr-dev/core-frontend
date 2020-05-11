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
echo $DATA_TOKEN_CONTRACT_ADDRESS
echo $DAI_TOKEN_CONTRACT_ADDRESS
echo $UNISWAP_ADAPTOR_CONTRACT_ADDRESS
echo $WEB3_REQUIRED_NETWORK_ID
echo $WEB3_PUBLIC_HTTP_PROVIDER
echo $WEB3_PUBLIC_WS_PROVIDER
echo $SENTRY_DSN
echo $LOGROCKET_SLUG
docker login -u "${DOCKER_USER}" -p "${DOCKER_PASS}"
WEB_ACL_ID=$(aws waf list-web-acls --region eu-west-1  --query "WebACLs[].WebACLId" --output text)
echo $WEB_ACL_ID
docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=eu-west-1 streamr/infra-marketplace-pr:stg  "(terraform init;terraform apply -auto-approve -var 'bucket_name=streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA' -var 'waf_acl_id=$WEB_ACL_ID')"
CONTAINER_ID=$(docker ps -a -q)
docker commit $CONTAINER_ID streamr/infra-marketplace-pr:stg
npm run build-index
npm run build
$(dirname $0)/build-storybook.sh
aws s3 sync --region eu-west-1 dist s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA
docker run streamr/infra-marketplace-pr:stg  "~/.local/bin/aws s3 cp --region eu-west-1 terraform.tfstate s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA"
docker run streamr/infra-marketplace-pr:stg  "~/.local/bin/aws s3 sync --region eu-west-1 .terraform s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA"

## Query AWS Cloudfront to get url for the PR created
S3_TRAVIS_PULL_REQUEST_SHA=streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA.s3.amazonaws.com
echo "                      _____   ______      _     _  ______                           ";
echo " ___ ___ ___ ___ ___ |_____] |_____/      |     | |_____/ |      ___ ___ ___ ___ ___";
echo "                     |       |    \_      |_____| |    \_ |_____                    ";
echo "                                                                                    ";
echo " http://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA.s3-website-eu-west-1.amazonaws.com"
echo "                      _____   ______      _     _  ______                           ";
echo " ___ ___ ___ ___ ___ |_____] |_____/      |     | |_____/ |      ___ ___ ___ ___ ___";
echo "                     |       |    \_      |_____| |    \_ |_____                    ";
echo "                                                                                    ";
