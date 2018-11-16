#!/usr/bin/env bash
cd ..
cd .explorer
npm run webpack:build -- --output-dir ../dist/${EXPLORER_BASE_PATH}
