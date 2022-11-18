resource "helm_release" "kube_prometheus_stack_release" {
  name      = "kube-prometheus-stack"
  namespace = kubernetes_namespace.kube_prometheus_stack_namespace.metadata[0].name

  chart  = "../../../charts/kube-prometheus-stack/chart"
  values = ["${file("../../../charts/kube-prometheus-stack/prod.values.yml")}"]

  set_sensitive {
    name  = "grafana.adminPassword"
    value = var.grafana_admin_password
  }

  depends_on = [
    kubernetes_namespace.kube_prometheus_stack_namespace,
    helm_release.cluster_issuers_release
  ]
}
