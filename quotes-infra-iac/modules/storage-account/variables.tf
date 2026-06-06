variable "resource_group_name" {
  description = "Resource Group name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "storage_account_name" {
  description = "Storage Account name"
  type        = string
}

variable "account_tier" {
  description = "Storage account tier"
  type        = string
  default     = "Standard"
}

variable "account_replication_type" {
  description = "Storage replication type"
  type        = string
  default     = "LRS"
}

variable "account_kind" {
  description = "Storage account kind"
  type        = string
  default     = "StorageV2"
}

variable "access_tier" {
  description = "Access tier for BlobStorage/StorageV2"
  type        = string
  default     = "Hot"
}

variable "min_tls_version" {
  description = "Minimum TLS version"
  type        = string
  default     = "TLS1_2"
}

variable "allow_nested_items_to_be_public" {
  description = "Allow nested items to be public"
  type        = bool
  default     = false
}

variable "shared_access_key_enabled" {
  description = "Enable shared access key"
  type        = bool
  default     = true
}

variable "public_network_access_enabled" {
  description = "Enable public network access"
  type        = bool
  default     = true
}

variable "https_traffic_only_enabled" {
  description = "Allow HTTPS traffic only"
  type        = bool
  default     = true
}

variable "create_container" {
  description = "Whether to create a blob container"
  type        = bool
  default     = true
}

variable "container_name" {
  description = "Blob container name"
  type        = string
  default     = "appdata"
}

variable "container_access_type" {
  description = "Container access type"
  type        = string
  default     = "private"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}