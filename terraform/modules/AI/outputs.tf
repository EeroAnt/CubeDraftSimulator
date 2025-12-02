output "ai_foundry_endpoint" {
  value = azurerm_ai_services.ai_foundry.endpoint
}

output "model_name" {
  value = azurerm_cognitive_deployment.drafter.name
}

output "api_key" {
  value = azurerm_ai_services.ai_foundry.primary_access_key
  sensitive = true
}