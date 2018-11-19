#!/usr/bin/env bash
cd .explorer
npm install --ignore-scripts
npm run vendor:icons-bundle
npm run webpack:build