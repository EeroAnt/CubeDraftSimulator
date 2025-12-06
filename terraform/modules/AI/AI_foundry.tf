resource "azurerm_ai_services" "ai_foundry" {
  for_each = var.regions

  name                  = "cubedraftAI-${each.key}"
  location              = each.value
  resource_group_name   = var.resource_group
  sku_name              = "S0"
  custom_subdomain_name = "cubedraft-${each.key}"
}