#!/bin/bash

git add -A

! git commit -am "OK" && exit 0

echo "Fim"