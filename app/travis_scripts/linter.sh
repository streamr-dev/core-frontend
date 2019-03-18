#!/usr/bin/env bash
echo "Run eslint"
npx eslint src
echo "Run stylinglint"
npx stylelint **/*.css **/*.[ps]css
