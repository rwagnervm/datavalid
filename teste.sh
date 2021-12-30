#!/bin/bash

git add -A

! git commit -am "OK" && exit 1

echo "Fim"