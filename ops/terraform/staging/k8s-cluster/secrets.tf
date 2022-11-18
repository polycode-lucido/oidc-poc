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
            "username" : "cluster-docker-pull",
            "password" : "${var.container_registry_password}",
            "email" : "cluster.docker.pull@polycode.do-2021.fr",
            "auth" : "${base64encode("cluster-docker-pull:${var.container_registry_password}")}"
          }
        }
      }
      EOF
  }
}

resource "helm_release" "sealed_secrets_release" {
  name      = "sealed-secrets-controller"
  namespace = "kube-system"

  chart  = "../../../charts/sealed-secrets/chart"
}
