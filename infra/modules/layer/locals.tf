locals {
  compatible_runtimes = ["nodejs20.x"]
  bucket_prefix       = "nestjs-dev-layers"
  build_dir           = "${path.module}/../../../build/layer"
  layer_dir           = "${local.build_dir}/${var.name}"
  filename            = "${local.build_dir}/${var.name}.zip"
  layer_s3_key        = "${var.name}.zip"
  package_json        = "${path.module}/../../../package.json"
}