#!/usr/bin/env bash
cd marketplace
echo "NPM install"
npm install

echo "Run eslint"
$TRAVIS_BUILD_DIR/marketplace/node_modules/.bin/eslint src

echo "Run stylint"
$TRAVIS_BUILD_DIR/marketplace//node_modules/.bin/stylelint **/*.css **/*.[ps]css
