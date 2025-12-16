terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.sub_id
}

module "statsWebApp" {
  source = "../../modules/statisticsWebApp/"

  location = var.location
  resourcegroup = var.resourcegroup
  webapp_name = var.webapp_name
  serviceplan = var.serviceplan
}