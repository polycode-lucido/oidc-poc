resource "helm_release" "ingress_nginx_release" {
  name      = "ingress-nginx"
  namespace = kubernetes_namespace.ingress_nginx_namespace.metadata[0].name

  chart  = "../../../charts/ingress-nginx/chart"
  values = ["${file("../../../charts/ingress-nginx/prod.values.yml")}"]

  depends_on = [
    kubernetes_namespace.ingress_nginx_namespace
  ]
}

resource "helm_release" "cert_manager_release" {
  name      = "cert-manager"
  namespace = kubernetes_namespace.cert_manager_namespace.metadata[0].name

  chart  = "../../../charts/cert-manager/chart"
  values = ["${file("../../../charts/cert-manager/prod.values.yml")}"]

  depends_on = [
    kubernetes_namespace.cert_manager_namespace,
    helm_release.ingress_nginx_release
  ]
}

resource "helm_release" "cluster_issuers_release" {
  name      = "cluster-issuers"
  namespace = kubernetes_namespace.cert_manager_namespace.metadata[0].name

  chart  = "../../../charts/cluster-issuers/chart"
  values = ["${file("../../../charts/cluster-issuers/prod.values.yml")}"]

  depends_on = [
    helm_release.cert_manager_release
  ]
}
