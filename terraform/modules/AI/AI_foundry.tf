resource "azurerm_ai_services" "ai_foundry" {
  name = "cubedraftAI-foundry"
  location = var.location
  resource_group_name = var.resource_group
  sku_name = "S0"
  custom_subdomain_name = "cubedraft-aifoundry"
}