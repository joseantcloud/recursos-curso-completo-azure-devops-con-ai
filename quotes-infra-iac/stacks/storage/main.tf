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
  count  = var.use_existing_resource_group ? 0 : 1
  source = "../../modules/resource-group"

  resource_group_name = var.resource_group_name
  location            = var.location
  environment         = var.environment
  owner               = var.owner
}

data "azurerm_resource_group" "existing" {
  count = var.use_existing_resource_group ? 1 : 0
  name  = var.resource_group_name
}

locals {
  resolved_resource_group_name = var.use_existing_resource_group ? data.azurerm_resource_group.existing[0].name : module.resource_group[0].name
  resolved_location            = var.use_existing_resource_group ? data.azurerm_resource_group.existing[0].location : var.location
}

module "storage_account" {
  source = "../../modules/storage-account"

  resource_group_name = local.resolved_resource_group_name
  location            = local.resolved_location

  storage_account_name         = var.storage_account_name
  account_tier                = var.account_tier
  account_replication_type    = var.account_replication_type
  account_kind                = var.account_kind
  access_tier                 = var.access_tier
  min_tls_version             = var.min_tls_version
  allow_nested_items_to_be_public = var.allow_nested_items_to_be_public
  shared_access_key_enabled   = var.shared_access_key_enabled
  public_network_access_enabled = var.public_network_access_enabled
  https_traffic_only_enabled  = var.https_traffic_only_enabled

  create_container      = var.create_container
  container_name        = var.container_name
  container_access_type = var.container_access_type

  tags = {
    environment = var.environment
    owner       = var.owner
    deployedBy  = "terraform"
  }
}