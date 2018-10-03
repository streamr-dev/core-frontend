#!/usr/bin/env bash
docker login -u "${DOCKER_USER}" -p "${DOCKER_PASS}"
WEB_ACL_ID=$(aws waf list-web-acls --region eu-west-1  --query "WebACLs[].WebACLId" --output text)
echo $WEB_ACL_ID
docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=eu-west-1 streamr/infra-marketplace-pr:stg  "(terraform init;terraform apply -auto-approve -var 'bucket_name=streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA' -var 'waf_acl_id=$WEB_ACL_ID')"
CONTAINER_ID=$(docker ps -a -q)
docker commit $CONTAINER_ID streamr/infra-marketplace-pr:stg
npm run build
aws s3 sync --region eu-west-1 dist s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA
docker run streamr/infra-marketplace-pr:stg  "~/.local/bin/aws s3 cp --region eu-west-1 terraform.tfstate s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA"
docker run streamr/infra-marketplace-pr:stg  "~/.local/bin/aws s3 sync --region eu-west-1 .terraform s3://streamr-marketplace-pr-$TRAVIS_PULL_REQUEST_SHA"