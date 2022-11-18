variable "gitlab_access_token" {
  type        = string
  description = "Access token to your Gitlab group"
  sensitive   = true
}

variable "ci_access_token" {
  type        = string
  description = "Access token for ci to your Gitlab group"
  sensitive   = true
}

variable "gitlab_base_url" {
  type    = string
  default = "https://gitlab.polytech.umontpellier.fr/api/v4/"
}

variable "gitlab_project_deploy_public_key" {
  type        = string
  description = "The public key used by ci to push to repositories"
}

variable "gitlab_project_deploy_private_key" {
  type        = string
  description = "The private key used by ci to push to repositories"
  sensitive   = true
}

data "gitlab_user" "do_polycode_developers" {
  for_each = toset(["alexis.langlet", "esteban.baron", "maxime.pizzolitto", "yann.pomie", "arsene.fougerouse"])

  username = each.value
}

data "gitlab_user" "do_polycode_maintainers" {
  for_each = toset(["alexis.bernard01", "nils.ponsard", "julien.dubois02"])

  username = each.value
}

data "gitlab_user" "do_polycode_owner" {
  for_each = toset(["alexandre.gomez01", "maxime.foucher", "simon.lucido"])

  username = each.value
}
