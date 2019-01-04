#!/usr/bin/env bash
cd ..
cd api-explorer
npm install
npm run vendor:icons-bundle
npm run webpack:build