#!/usr/bin/env bash
set -e
echo "Run eslint"
npx eslint src
echo "Run stylinglint"
npx stylelint ./**/*.css ./**/*.[ps]css
