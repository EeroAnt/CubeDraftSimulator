# App Service Plan
resource "azurerm_service_plan" "cubestats" {
  name                = var.serviceplan
  location            = var.location
  resource_group_name = var.resourcegroup
  os_type             = "Linux"
  sku_name            = "F1"
}

# Web App
resource "azurerm_linux_web_app" "cubestats" {
  name                    = var.webapp_name
  location                = var.location
  resource_group_name     = var.resourcegroup
  service_plan_id         = azurerm_service_plan.cubestats.id
  client_affinity_enabled = true
  https_only              = true

  site_config {
    always_on                         = false
    ftps_state                        = "FtpsOnly"
    http2_enabled                     = true
    ip_restriction_default_action     = "Allow"
    scm_ip_restriction_default_action = "Allow"
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    "DATA_URL" = "https://raw.githubusercontent.com/EeroAnt/CubeDraftSimulator/refs/heads/main/CubeStats/CubeStatsData/data.json"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "True"
  }

  logs {
    detailed_error_messages = false
    failed_request_tracing  = false

    http_logs {
      file_system {
        retention_in_days = 3
        retention_in_mb   = 100
      }
    }
  }
}