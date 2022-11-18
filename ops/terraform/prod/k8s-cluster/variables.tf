variable "kubeconfig_context_name" {
  type    = string
  default = "k3d-prod-polycode"
}

variable "kubeconfig_path" {
  type    = string
  default = "~/.kube/config"
}

variable "grafana_admin_password" {
  type        = string
  description = "Grafana admin password"
  sensitive   = true
}

variable "argo_cd_admin_password" {
  type        = string
  description = "Argo CD bcrypt hashed admin password"
  sensitive   = true
}
