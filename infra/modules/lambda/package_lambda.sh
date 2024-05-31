#!/bin/bash

# Package a lambda function
#
# Parameters:
#   $name: Lambda name
#   $source_dir: Lambda source directory
#   $build_dir: Build directory
#   $filename: Output zip file name
#
# Example:
#   ./package_lambda.sh app_lambda ../../../../app ../../../../build/lambda app_lambda.zip

set -e

eval "$(jq -r '@sh "name=\(.name) source_dir=\(.source_dir) build_dir=\(.build_dir) filename=\(.filename)"')"

cd "$(dirname "$0")"

rm -rf $build_dir
mkdir -p $build_dir
cp -R $source_dir/* $build_dir

cd $build_dir

zip -r $name.zip . -q

jq -n --arg filename "$filename" '{"filename":$filename}'