#!/usr/bin/env bash
cd marketplace
get_map_file_path=$(find dist -name '*.map')
get_map_file=$(echo $get_map_file_path | cut -d"/" -f2)

get_source_file_path=$(find dist -name '*.js')
get_source_file=$(echo get_source_file_path | cut -d"/" -f2)

echo "Set Release"
curl https://sentry.io/api/0/projects/streamr/marketplace/releases/ \
  -X POST \
  -H "Authorization: Bearer $SENTRY_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"version\": \"$TRAVIS_TAG\" }" \

echo "Upload map"
curl https://sentry.io/api/0/projects/streamr/marketplace/releases/${TRAVIS_TAG}/files/ \
  -X POST \
  -H "Authorization: Bearer $SENTRY_TOKEN" \
  -F file=@$get_map_file_path \
  -F name="https://marketplace.streamr.com/${get_map_file}"

echo "Upload source"
 curl https://sentry.io/api/0/projects/streamr/marketplace/releases/${TRAVIS_TAG}/files/ \
  -X POST \
  -H "Authorization: Bearer $SENTRY_TOKEN" \
  -F file=@get_source_file_path \
  -F name="https://marketplace.streamr.com/${get_source_file}"


## Remove map to not upload
rm $get_map_file_path
