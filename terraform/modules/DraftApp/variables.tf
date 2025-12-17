variable "location" {}
variable "resource_group" {}
variable "container_group_name" {}
variable "dns_name_label" {}
variable "acr_name" {}
variable "model_name" {}
variable "encryption_key" {}
variable "db_user" {}
variable "db_password" {
  sensitive = true
}
variable "db_port" {}
variable "db_name" {}
variable "db_dns" {}
variable "db_dns_port" {}
variable "flask_secret_key" {
  sensitive = true
}
variable "ssh_user" {}
variable "ssh_passphrase" {
  sensitive = true
}
variable "ssh_key" {
  sensitive = true
}