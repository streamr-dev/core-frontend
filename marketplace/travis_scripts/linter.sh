#!/usr/bin/env bash
cd marketplace
./node_modules/.bin/eslint src
./node_modules/.bin/stylelint **/*.css **/*.[ps]css
