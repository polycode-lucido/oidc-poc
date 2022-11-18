resource "gitlab_project" "ops_project" {
  name             = "ops"
  description      = "Ops team project for Polycode"
  visibility_level = "private"
  namespace_id     = gitlab_group.do_polycode_group.id

  remove_source_branch_after_merge                 = true
  autoclose_referenced_issues                      = true
  merge_method                                     = "ff"
  only_allow_merge_if_all_discussions_are_resolved = true
  only_allow_merge_if_pipeline_succeeds            = true
  squash_option                                    = "always"
  squash_commit_template                           = <<EOF
%%{title}

%%{description}
EOF

  shared_runners_enabled = true

  archive_on_destroy = true
}

resource "gitlab_deploy_key" "ops_do_bot_deploy_key" {
  project = gitlab_project.ops_project.id
  title   = "do-bot"
  key     = var.gitlab_project_deploy_public_key

  can_push = true
}

resource "gitlab_branch_protection" "ops_main_branch_protection" {
  project = gitlab_project.ops_project.id
  branch  = "main"

  allow_force_push   = false
  merge_access_level = "maintainer"
  # push_access_level doesn't work with deploy key so we'll setup manually
}

resource "gitlab_tag_protection" "ops_versioning_tag_protection" {
  project = gitlab_project.ops_project.id
  tag     = "v*"

  create_access_level = "maintainer"
}
