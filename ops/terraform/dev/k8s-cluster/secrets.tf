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
          "https://gitlab.polytech.umontpellier.fr:5050" : {
            "username" : "container-registry",
            "password" : "${var.container_registry_password}",
            "email" : "simon.lucido@etu.umontpellier.fr",
            "auth" : "${base64encode("container-registry:${var.container_registry_password}")}"
          }
        }
      }
      EOF
  }
}
