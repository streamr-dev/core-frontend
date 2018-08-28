#!/usr/bin/env bash
cd marketplace
echo "Run eslint"
./node_modules/.bin/eslint src
echo "Run stylinglint"
./node_modules/.bin/stylelint **/*.css **/*.[ps]css
