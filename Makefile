.PHONY: help terraform-init terraform-fmt terraform-apply

default: help

help: # Show help for each of the Makefile recipes.
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

terraform-init: # Initialize terraform
	cd infra/live/${stage} && terraform init

terraform-fmt: # Format terraform
	cd infra/live/${stage} && terraform fmt 

terraform-apply: # Apply terraform
	cd infra/live/${stage} && terraform apply -auto-approve -var "stage=${stage}" -var "region=${region}"