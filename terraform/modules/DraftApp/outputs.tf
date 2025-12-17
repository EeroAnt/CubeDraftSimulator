output "fqdn" {
  description = "Fully qualified domain name"
  value       = azurerm_container_group.main.fqdn
}

output "ip_address" {
  description = "Public IP address"
  value       = azurerm_container_group.main.ip_address
}