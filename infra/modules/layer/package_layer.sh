#!/bin/bash

# Package a layer for a Lambda function
#
# Parameters:
#   $layer_name: Layer name
#   $build_dir: Build directory
#   $filename: Output filename
#
# Example:
#   ./package_layer.sh deps_layer ../../../../build/layer deps_layer.zip

set -e

eval "$(jq -r '@sh "layer_name=\(.layer_name) build_dir=\(.build_dir) filename=\(.filename)"')"

cd "$(dirname "$0")"

layer_dir="$build_dir/$layer_name"
nodejs_dir="$layer_dir/nodejs"
rm -rf $build_dir
mkdir -p "$nodejs_dir"

BASE_DIR=../../..

cp "$BASE_DIR/package.json" "$nodejs_dir"
cd "$nodejs_dir"

pnpm i -P --silent

cd ..

zip -r --symlinks "$layer_name.zip" nodejs -q
mv "$layer_name.zip" "../$layer_name.zip"
rm -rf "../$layer_name"

jq -n --arg filename "$filename" '{"filename":$filename}'