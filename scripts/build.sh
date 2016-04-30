#!/bin/bash

set -o errexit -o nounset

rm -rf app; 

npm run lint; 
npm test; 

mkdir app; 

# move the src files to app
cp -r .tmp/src/. app/
cp package.json app/

# remove source maps
rm app/*.map
rm app/**/*.map

# rename index.js to server.js to comply with defaults of Azure
mv app/index.js app/server.js