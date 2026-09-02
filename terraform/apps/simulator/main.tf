terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

module "draftApp" {
  source = "../../modules/DraftApp/"

  location             = var.location
  resource_group       = var.resource_group
  container_group_name = var.container_group_name
  dns_name_label       = var.dns_name_label
  acr_name             = var.acr_name
  model_name           = var.model_name
  encryption_key       = var.encryption_key
  db_user              = var.db_user
  db_password          = var.db_password
  db_port              = var.db_port
  db_name              = var.db_name
  db_host              = var.db_host
  flask_secret_key     = var.flask_secret_key
}