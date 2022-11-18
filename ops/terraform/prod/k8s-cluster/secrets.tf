resource "helm_release" "sealed_secrets_release" {
  name      = "sealed-secrets-controller"
  namespace = "kube-system"

  chart  = "../../../charts/sealed-secrets/chart"
}
