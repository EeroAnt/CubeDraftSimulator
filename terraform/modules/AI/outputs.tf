output "endpoints" {
  value = {
    for k, v in azurerm_ai_services.ai_foundry : k => {
      endpoint = v.endpoint
      key      = v.primary_access_key
    }
  }
  sensitive = true
}