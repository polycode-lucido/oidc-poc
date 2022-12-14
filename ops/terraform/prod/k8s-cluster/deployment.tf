resource "helm_release" "argo_cd_release" {
  name      = "argo-cd"
  namespace = kubernetes_namespace.argo_cd_namespace.metadata[0].name

  chart  = "../../../charts/argo-cd/chart"
  values = ["${file("../../../charts/argo-cd/prod.values.yml")}"]

  set_sensitive {
    name  = "configs.secret.argocdServerAdminPassword"
    # This value need to be bcrypt hashed
    # To hash it you can run : htpasswd -nbBC 10 "" $ARGO_PWD | tr -d ':\n' | sed 's/$2y/$2a/'
    value = var.argo_cd_admin_password
  }

  depends_on = [
    kubernetes_namespace.argo_cd_namespace,
  ]
}
