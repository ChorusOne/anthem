#!/bin/bash

# Copies mock GraphQL response data from the GraphQL server repo into the
# Staking Dashboard repo. This data is used for testing and mocking.

DIR=../server/src/client/data
DEST=./src/test

echo ""
echo "Generating mock data in client project using source repo: $DIR"

if test -d "$DIR"; then
  cp -r $DIR $DEST
fi

cp ../server/src/client/query-keys.ts src/graphql

echo "Success!"
echo ""