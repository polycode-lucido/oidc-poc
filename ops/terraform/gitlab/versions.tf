terraform {
  backend "http" {}

  required_providers {
    gitlab = {
      source  = "gitlabhq/gitlab"
      version = "3.15.0"
    }
  }
}
