output "ai_foundry_endpoint" {
  value = module.ai_foundry.ai_foundry_endpoint
}

output "model_name" {
  value = module.ai_foundry.model_name
}

output "api_key" {
  value = module.ai_foundry.api_key
  sensitive = true
}