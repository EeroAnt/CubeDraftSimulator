resource "azurerm_cognitive_deployment" "drafter" {
  for_each = var.regions

  name                 = "draft-model"
  cognitive_account_id = azurerm_ai_services.ai_foundry[each.key].id

  model {
    format  = "OpenAI"
    name    = "gpt-4.1-mini"
    version = "2025-04-14"
  }

  sku {
    name     = "GlobalStandard"
    capacity = 200
  }

  version_upgrade_option = "OnceNewDefaultVersionAvailable"
  rai_policy_name        = "Microsoft.DefaultV2"
}