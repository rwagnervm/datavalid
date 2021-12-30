#!/bin/bash

git add -A

if git commit -am "OK"; then
    echo "First: success!"
else
    echo "First: failure!"
fi
echo "Fim"