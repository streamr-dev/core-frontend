#!/usr/bin/env bash
docker login -u "${DOCKER_USER}" -p "${DOCKER_PASS}"
WEB_ACL_ID=$(aws waf list-web-acls --region eu-west-1  --query "WebACLs[].WebACLId" --output text)
echo $WEB_ACL_ID
docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=eu-west-1 streamr/infra-marketplace-pr:stg  "(terraform init;terraform apply -auto-approve -var 'bucket_name=streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA' -var 'waf_acl_id=$WEB_ACL_ID')"
CONTAINER_ID=$(docker ps -a -q)
docker commit $CONTAINER_ID streamr/infra-marketplace-pr:stg
npm run build
./build-storybook.sh
aws s3 sync --region eu-west-1 dist s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA
docker run streamr/infra-marketplace-pr:stg  "~/.local/bin/aws s3 cp --region eu-west-1 terraform.tfstate s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA"
docker run streamr/infra-marketplace-pr:stg  "~/.local/bin/aws s3 sync --region eu-west-1 .terraform s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA"

## Query AWS Cloudfront to get url for the PR created
S3_TRAVIS_PULL_REQUEST_SHA=streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA.s3.amazonaws.com
echo "                      _____   ______      _     _  ______                           ";
echo " ___ ___ ___ ___ ___ |_____] |_____/      |     | |_____/ |      ___ ___ ___ ___ ___";
echo "                     |       |    \_      |_____| |    \_ |_____                    ";
echo "                                                                                    ";
aws cloudfront list-distributions | jq '[.DistributionList.Items[]  | {bucket: .Origins.Items[0].DomainName, url: .DomainName}]' | jq -r --arg S3_TRAVIS_PULL_REQUEST_SHA "$S3_TRAVIS_PULL_REQUEST_SHA" '.[] | select(.bucket==$S3_TRAVIS_PULL_REQUEST_SHA)'
echo "                      _____   ______      _     _  ______                           ";
echo " ___ ___ ___ ___ ___ |_____] |_____/      |     | |_____/ |      ___ ___ ___ ___ ___";
echo "                     |       |    \_      |_____| |    \_ |_____                    ";
echo "                                                                                    ";