output "storage_account_id" {
  value = module.storage_account.storage_account_id
}

output "storage_account_name" {
  value = module.storage_account.storage_account_name
}

output "primary_blob_endpoint" {
  value = module.storage_account.primary_blob_endpoint
}

output "primary_web_endpoint" {
  value = module.storage_account.primary_web_endpoint
}

output "container_name" {
  value = module.storage_account.container_name
}