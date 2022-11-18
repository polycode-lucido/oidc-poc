resource "kubernetes_secret" "gitlab_registry_pull_secret" {
  metadata {
    name      = "registry-credentials"
    namespace = kubernetes_namespace.polycode_namespace.metadata[0].name
  }

  type = "kubernetes.io/dockerconfigjson"

  data = {
    ".dockerconfigjson" = <<EOF
      {
        "auths" : {
          "https://docker.repo.nexus.polycode.do-2021.fr" : {
            "username" : "local-docker-pull",
            "password" : "${var.container_registry_password}",
            "email" : "local.docker.pull@polycode.do-2021.fr",
            "auth" : "${base64encode("local-docker-pull:${var.container_registry_password}")}"
          }
        }
      }
      EOF
  }
}

