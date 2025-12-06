output "ai_foundry_configs" {
  value = [
    for k, v in module.ai_foundry.endpoints : {
      endpoint = v.endpoint
      key      = v.key
    }
  ]
  sensitive = true
}