resource "azurerm_virtual_network" "this" {
  name                = var.vnet_name
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = var.vnet_address_space

  tags = var.tags
}

resource "azurerm_subnet" "aks" {
  name                 = var.subnet_name
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = var.subnet_address_prefixes
}

resource "azurerm_kubernetes_cluster" "this" {
  name                = var.aks_name
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version
  sku_tier            = var.sku_tier

  oidc_issuer_enabled       = true
  workload_identity_enabled = true

  default_node_pool {
    name                 = "system"
    vm_size              = var.default_node_pool_vm_size
    node_count           = var.default_node_pool_node_count
    vnet_subnet_id       = azurerm_subnet.aks.id
    os_disk_size_gb      = var.default_node_pool_os_disk_size_gb
    auto_scaling_enabled = var.default_node_pool_enable_auto_scaling
    min_count            = var.default_node_pool_min_count
    max_count            = var.default_node_pool_max_count
    type                 = "VirtualMachineScaleSets"
    zones                = var.default_node_pool_zones
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin      = "azure"
    network_plugin_mode = "overlay"
    network_policy      = "azure"
    load_balancer_sku   = "standard"
    pod_cidr            = var.pod_cidr
    service_cidr        = var.service_cidr
    dns_service_ip      = var.dns_service_ip
  }

  role_based_access_control_enabled = true

  tags = var.tags
}