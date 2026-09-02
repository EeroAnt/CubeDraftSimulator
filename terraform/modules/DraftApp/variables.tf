variable "location" {}
variable "resource_group" {}
variable "container_group_name" {}
variable "dns_name_label" {}
variable "acr_name" {}
variable "model_name" {}
variable "encryption_key" {}
variable "db_host" {}
variable "db_user" {}
variable "db_password" {
  sensitive = true
}
variable "db_port" {}
variable "db_name" {}
variable "flask_secret_key" {
  sensitive = true
}
