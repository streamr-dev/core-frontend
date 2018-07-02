get_map_file_path=$(find dist -name '*.map')
get_map_file=$(echo $get_map_file_path | cut -d"/" -f2)

curl https://sentry.io/api/0/projects/streamr/marketplace/releases/ \
  -X POST \
  -H "Authorization: Bearer $SENTRY_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"version\": \"$TRAVIS_TAG\" }" \

curl https://sentry.io/api/0/projects/streamr/marketplace/releases/${TRAVIS_TAG}/files/ \
  -X POST \
  -H "Authorization: Bearer $SENTRY_TOKEN" \
  -F file=@$get_map_file_path \
  -F name="https://marketplace.streamr.com/${get_map_file}"

rm $get_map_file_path
