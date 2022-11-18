resource "gitlab_group" "do_polycode_group" {
  name             = "do-polycode"
  path             = "do-polycode"
  description      = "Polycode group"
  visibility_level = "private"

  project_creation_level = "developer"
}

resource "gitlab_group_membership" "do_polycode_developer_membership" {
  for_each = data.gitlab_user.do_polycode_developers
  group_id = gitlab_group.do_polycode_group.id
  user_id  = each.value.user_id

  access_level = "developer"
}

resource "gitlab_group_membership" "do_polycode_maintainer_membership" {
  for_each = data.gitlab_user.do_polycode_maintainers
  group_id = gitlab_group.do_polycode_group.id
  user_id  = each.value.user_id

  access_level = "maintainer"
}

resource "gitlab_group_membership" "do_polycode_owner_membership" {
  for_each = data.gitlab_user.do_polycode_owner
  group_id = gitlab_group.do_polycode_group.id
  user_id  = each.value.user_id

  access_level = "owner"
}

resource "gitlab_deploy_token" "container_registry_deploy_token" {
  name  = "container-registry"
  group = gitlab_group.do_polycode_group.id

  username = "container-registry"
  scopes   = ["read_repository", "read_registry", "read_package_registry"]
}

resource "gitlab_group_variable" "terraform_access_token_group_variable" {
  group = gitlab_group.do_polycode_group.id
  key   = "TF_ACCESS_TOKEN"
  value = var.gitlab_access_token

  protected         = true
  masked            = true
  environment_scope = "*"
}

resource "gitlab_group_variable" "ci_access_token_group_variable" {
  group = gitlab_group.do_polycode_group.id
  key   = "GITLAB_CI_TOKEN"
  value = var.ci_access_token

  protected         = true
  masked            = true
  environment_scope = "*"
}

resource "gitlab_group_variable" "deploy_key_group_variable" {
  group = gitlab_group.do_polycode_group.id
  key   = "GITLAB_GIT_PRIVATE_KEY"
  value = var.gitlab_project_deploy_private_key

  protected         = true
  masked            = false
  environment_scope = "*"
}

resource "gitlab_group_label" "feature_group_label" {
  group       = gitlab_group.do_polycode_group.id
  name        = "feature"
  description = "Feature label"
  color       = "#A2EEEF"
}

resource "gitlab_group_label" "bug_fix_group_label" {
  group       = gitlab_group.do_polycode_group.id
  name        = "bug fix"
  description = "Bug fix label"
  color       = "#D73A4A"
}

resource "gitlab_group_label" "documentation_group_label" {
  group       = gitlab_group.do_polycode_group.id
  name        = "documentation"
  description = "Documentation label"
  color       = "#0075CA"
}

resource "gitlab_group_label" "test_group_label" {
  group       = gitlab_group.do_polycode_group.id
  name        = "test"
  description = "Label for testing"
  color       = "#969696"
}

resource "gitlab_group_label" "breaking_changes_group_label" {
  group       = gitlab_group.do_polycode_group.id
  name        = "BREAKING CHANGES"
  description = "Label meaning this resource include breaking changes"
  color       = "#D93F0B"
}
