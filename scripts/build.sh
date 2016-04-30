#!/bin/bash
rm -rf app; 
npm run lint; 
npm test; 
mkdir app; 
cp -r .tmp/src/. app/