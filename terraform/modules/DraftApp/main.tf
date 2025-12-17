locals {
  ai_regions = ["sweden", "poland", "italy", "germany", "france", "swiss", "spain"]
}

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.resource_group
}

data "azurerm_cognitive_account" "foundries" {
  for_each            = toset(local.ai_regions)
  name                = "cubedraftAI-${each.key}"
  resource_group_name = var.resource_group
}

resource "azurerm_container_group" "main" {
  name                = var.container_group_name
  location            = var.location
  resource_group_name = var.resource_group
  os_type             = "Linux"
  ip_address_type     = "Public"
  dns_name_label      = var.dns_name_label
  restart_policy      = "Never"
  

  image_registry_credential {
    server   = data.azurerm_container_registry.acr.login_server
    username = data.azurerm_container_registry.acr.admin_username
    password = data.azurerm_container_registry.acr.admin_password
  }

  container {
    name                  = "eeronsimulator"
    image                 = "${data.azurerm_container_registry.acr.login_server}/draft-simulator-front:latest"
    cpu                   = 0.5
    memory                = 1.0
    cpu_limit             = 0
    memory_limit          = 0

    ports {
      port     = 80
      protocol = "TCP"
    }
  }

  container {
    name         = "eeronnode"
    image        = "${data.azurerm_container_registry.acr.login_server}/draft-simulator-back:latest"
    cpu          = 0.5
    memory       = 1.0
    cpu_limit    = 0
    memory_limit = 0

    ports {
      port     = 3001
      protocol = "TCP"
    }

    environment_variables = {
      "FLASK_URL"        = "http://localhost:5002"
      "MODEL"            = var.model_name
      "KEY_FRANCE"       = data.azurerm_cognitive_account.foundries["france"].primary_access_key
      "ENDPOINT_FRANCE"  = data.azurerm_cognitive_account.foundries["france"].endpoint
      "KEY_GERMANY"      = data.azurerm_cognitive_account.foundries["germany"].primary_access_key
      "ENDPOINT_GERMANY" = data.azurerm_cognitive_account.foundries["germany"].endpoint
      "KEY_ITALY"        = data.azurerm_cognitive_account.foundries["italy"].primary_access_key
      "ENDPOINT_ITALY"   = data.azurerm_cognitive_account.foundries["italy"].endpoint
      "KEY_POLAND"       = data.azurerm_cognitive_account.foundries["poland"].primary_access_key
      "ENDPOINT_POLAND"  = data.azurerm_cognitive_account.foundries["poland"].endpoint
      "KEY_SWEDEN"       = data.azurerm_cognitive_account.foundries["sweden"].primary_access_key
      "ENDPOINT_SWEDEN"  = data.azurerm_cognitive_account.foundries["sweden"].endpoint
      "KEY_SWISS"        = data.azurerm_cognitive_account.foundries["swiss"].primary_access_key
      "ENDPOINT_SWISS"   = data.azurerm_cognitive_account.foundries["swiss"].endpoint
      "KEY_SPAIN"        = data.azurerm_cognitive_account.foundries["spain"].primary_access_key
      "ENDPOINT_SPAIN"   = data.azurerm_cognitive_account.foundries["spain"].endpoint
    }

    secure_environment_variables = {
      "MY_ENCRYPTION" = var.encryption_key
    }
  }

  container {
    name         = "eeronflask"
    image        = "${data.azurerm_container_registry.acr.login_server}/draft-simulator-flask:latest"
    cpu          = 0.5
    memory       = 1.0
    cpu_limit    = 0
    memory_limit = 0

    ports {
      port     = 5002
      protocol = "TCP"
    }

    environment_variables = {
      "DB_PORT"        = var.db_port
      "DB_NAME"        = var.db_name
      "DB_USER"        = var.db_user
      "FLASK_RUN_PORT" = "5002"
      "DNS"            = var.db_dns
      "DNS_PORT"       = var.db_dns_port
      "SSH_USER"       = var.ssh_user
    }

    secure_environment_variables = {
      "DB_PASSWORD"    = var.db_password
      "SECRET_KEY"     = var.flask_secret_key
      "SSH_PASSPHRASE" = var.ssh_passphrase
      "SSH_KEY"        = var.ssh_key
    }
  }

  exposed_port {
    port     = 80
    protocol = "TCP"
  }

  exposed_port {
    port     = 3001
    protocol = "TCP"
  }
}