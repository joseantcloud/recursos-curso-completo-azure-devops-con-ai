terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

module "resource_group" {
  source = "../../modules/resource-group"

  resource_group_name = var.resource_group_name
  location            = var.location
  environment         = var.environment
  owner               = var.owner
}

module "aks" {
  source = "../../modules/aks"

  resource_group_name = module.resource_group.name
  location            = var.location

  aks_name                        = var.aks_name
  dns_prefix                      = var.dns_prefix
  kubernetes_version              = var.kubernetes_version
  sku_tier                        = var.sku_tier
  vnet_name                       = var.vnet_name
  vnet_address_space              = var.vnet_address_space
  subnet_name                     = var.subnet_name
  subnet_address_prefixes         = var.subnet_address_prefixes
  default_node_pool_vm_size       = var.default_node_pool_vm_size
  default_node_pool_node_count    = var.default_node_pool_node_count
  default_node_pool_os_disk_size_gb = var.default_node_pool_os_disk_size_gb
  default_node_pool_enable_auto_scaling = var.default_node_pool_enable_auto_scaling
  default_node_pool_min_count     = var.default_node_pool_min_count
  default_node_pool_max_count     = var.default_node_pool_max_count
  default_node_pool_zones         = var.default_node_pool_zones
  pod_cidr                        = var.pod_cidr
  service_cidr                    = var.service_cidr
  dns_service_ip                  = var.dns_service_ip

  tags = {
    environment = var.environment
    owner       = var.owner
    deployedBy  = "terraform"
  }
}