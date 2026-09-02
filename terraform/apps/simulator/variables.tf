variable "location" {}
variable "resource_group" {}
variable "container_group_name" {}
variable "dns_name_label" {}
variable "acr_name" {}
variable "subscription_id" {}
variable "encryption_key" {}
variable "model_name" {}
variable "db_user" {}
variable "db_password" {
  sensitive = true
}
variable "db_port" {}
variable "db_name" {}
variable "db_host" {}
variable "flask_secret_key" {
  sensitive = true
}
