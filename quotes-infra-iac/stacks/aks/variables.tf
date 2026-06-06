variable "subscription_id" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "environment" {
  type = string
}

variable "owner" {
  type = string
}

variable "aks_name" {
  type = string
}

variable "dns_prefix" {
  type = string
}

variable "kubernetes_version" {
  type    = string
  default = null
}

variable "sku_tier" {
  type    = string
  default = "Free"
}

variable "vnet_name" {
  type = string
}

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.20.0.0/16"]
}

variable "subnet_name" {
  type    = string
  default = "snet-aks"
}

variable "subnet_address_prefixes" {
  type    = list(string)
  default = ["10.20.1.0/24"]
}

variable "default_node_pool_vm_size" {
  type    = string
  default = "Standard_D2s_v5"
}

variable "default_node_pool_node_count" {
  type    = number
  default = 1
}

variable "default_node_pool_os_disk_size_gb" {
  type    = number
  default = 128
}

variable "default_node_pool_enable_auto_scaling" {
  type    = bool
  default = false
}

variable "default_node_pool_min_count" {
  type    = number
  default = 1
}

variable "default_node_pool_max_count" {
  type    = number
  default = 1
}

variable "default_node_pool_zones" {
  type    = list(string)
  default = []
}

variable "pod_cidr" {
  type    = string
  default = "10.244.0.0/16"
}

variable "service_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "dns_service_ip" {
  type    = string
  default = "10.0.0.10"
}