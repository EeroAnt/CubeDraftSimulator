output "app_url" {
  description = "Draft app URL"
  value       = "http://${module.draftApp.fqdn}"
}