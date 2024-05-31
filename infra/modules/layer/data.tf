data "external" "layer" {
  program = ["bash", "${path.module}/package_layer.sh"]

  query = {
    layer_name = var.name
    build_dir  = local.build_dir
    filename   = local.filename
  }
}