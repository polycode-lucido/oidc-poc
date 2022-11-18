resource "kubernetes_namespace" "polycode_namespace" {
  metadata {
    name = "polycode"
  }
}

resource "kubernetes_namespace" "ingress_nginx_namespace" {
  metadata {
    name = "ingress-nginx"
  }
}

resource "kubernetes_namespace" "cert_manager_namespace" {
  metadata {
    name = "cert-manager"
  }
}

resource "kubernetes_namespace" "kube_prometheus_stack_namespace" {
  metadata {
    name = "kube-prometheus-stack"
  }
}
