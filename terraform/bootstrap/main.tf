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

module "ai_foundry" {
  source = "../modules/AI/"
  resource_group = var.resource_group
}