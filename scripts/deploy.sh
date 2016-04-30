#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cd app

git init
git config user.name "Sergey Bolshchikov"
git config user.email "sergey@bolshchikov.net"

git remote add upstream "https://$GH_TOKEN@github.com/streets/technion-guide-bot.git"
git fetch upstream
git reset upstream/deploy

touch .

git add -A .
git commit -m "redeploy at ${rev}"
git push -q upstream HEAD:deploy