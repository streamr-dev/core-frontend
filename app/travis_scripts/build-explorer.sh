#!/usr/bin/env bash
cd .explorer
npm install
npm run vendor:icons-bundle
npm run webpack:build