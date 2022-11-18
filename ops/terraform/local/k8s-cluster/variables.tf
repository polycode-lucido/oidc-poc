variable "kubeconfig_context_name" {
  type    = string
  default = "k3d-local-polycode"
}

variable "kubeconfig_path" {
  type    = string
  default = "~/.kube/config"
}

variable "grafana_admin_password" {
  type        = string
  description = "Grafana admin password"
  default     = "admin"
  sensitive   = true
}

variable "argo_cd_admin_password" {
  type        = string
  description = "Argo CD bcrypt hashed admin password"
  default     = "$2y$10$adCiprUiugTubOEkA49aierhMbxym5Q3T5M3FAXLZ3qKpq3q1gWyS"
  sensitive   = true
}
