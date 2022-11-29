resource "helm_release" "ingress_nginx_release" {
  name      = "ingress-nginx"
  namespace = kubernetes_namespace.ingress_nginx_namespace.metadata[0].name

  chart  = "../../../charts/ingress-nginx/chart"
  values = ["${file("../../../charts/ingress-nginx/prod.values.yml")}"]

  depends_on = [
    kubernetes_namespace.ingress_nginx_namespace
  ]
}
