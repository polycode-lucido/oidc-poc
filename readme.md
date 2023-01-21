# OIDC POC

This project is here to demonstrate how I would I would revamp the Polycode's authentication and authorization system, using Keycloak as our OIDC provider.

Here's a link to a currently running deployment of the project: https://poly-code.com

## Architecture
We have the same architecture as the current one, with a few changes, except for the authentication and authorization part. The keycloak instance is running outside our Kubernetes cluster, and is accessible via a public IP address. The OIDC provider is configured to use the `openid` and `profile` scopes, and the `email` claim. The `email` claim is used to identify the user, and the `profile` scope is used to get the user's name.

## Here are a few keypoints of difference with the current architecture:

### Authentication is done through the use of Cookies, and not JWT tokens at the frontend.
### Authentication and authorization are done through the use of OIDC, by using keycloak as our IdP.
### The backend is our resource server and our client.

## Installation
### Pre-requisites

For the "development" environment, you need:
- docker
- nodejs
- npm

For the "production" environment, you need:
- ansible, with a root access to a machine via ssh
- terraform
- helm
- A keycloak instance

### How to run, in a "development" environment

- Go to the backend folder and run `docker compose up -d`, then `npm run start`
- Connect to the keycloak instance, and create a new realm, with the name `polycode`
- Create a new client, with the name `polycode-api`, and set the `Access Type` to `confidential`, enabling authorization
- Go to the `Credentials` tab, and copy the `Secret` value
- Add a new `Valid Redirect URIs` value, with the value `http://localhost:3001/*`
- Edit a `.env` file in the `backend` folder from the `example.env` value, and set the appropriate values
- `npm i` and `npm run dev` on the backend first, then `npm i` and `npm run dev` on the frontend

#### Setting up authorization

You will be able to login and create accounts via your fresh keycloak instance, however, no authorization is configured yet
- Go to the `Realm roles` tab, and create a new role, with the name `app-user`
- Go to the `Users` tab, and set this role to any existing user
- Go to `Realm Settings`, then `User Registration` and add the `app-user role` to the default roles list

We have set a default role for our users, let's now give them some permissions
- Go to the `Clients` tab, and select the `polycode-api` client
- Go to the `Authorization` tab, then `Scopes` and create a new scope, with the names `read`, `write`, `delete` and `update`.
- Go to the `Resources` tab, and create a new resource, with the name `content`, content type `content`, and add all the previously created scopes.
Do the same for the following resources:

- `user`, content type `user`
- `user_email`, content type `user`
- `user_settings`, content type `user`
- `module`, content type `content`
- `item`, no content type

This is not an exhaustive list, but it is enough to demonstrate the concept. You can add more resources and scopes if you want to.

Move to the `Policies` tab, and create a new policy, with the name `user`, with the type `role`. Then, add the `app-user` role to the policy.

Move to the `Permissions` tab, and create a new scoped-based permission, with the name `user_content_read`, with the resource type `content`, and the scope `read`. Then, add the `user` policy to the permission. Do the same for the user content type.

You have your authorization configured, meaning that you can actually use the site. It is not complete at all, but it allow to show that you can manage authentication and authorization with keycloak.

### How to run, in a "production" environment

Full disclaimer: this is a bit tidious, since you have to manually edit the host values for each of the helm charts (back, front, runner, grafana and argo). Expect to spend some time on this.

- Clone the repo
- Move to `ops/ansible/create_cluster/`
- Edit `inventory.ini` (and you may want to edit `ops/create_cluster/k3d_config.yaml` if you have particular k3d configuration needs, as it is there is no ingress controller)
- Run `ansible-playbook ./main.yaml`
- Move to `ops/charts/argo-cd` and edit `prod.values.yaml`. You will need to change the host for the ingress.
- Do the same for `ops/charts/argo-cd/prod.values.yml` 
- Move to `ops/terraform/prod/k8s-cluster/`
- Delete the `terraform.tfstate`, `terraform.tfstate.backup` and `terraform.lock.hcl` files if they exists
- Run `terraform init`
- You will need to provide a bcrypted password for argo, you can generate one online.
- Run `terraform apply`
- Hooray ! You can log into ArgoCD and deploy the charts.. Right ? No, you still need to edit the host for the ingress of the charts. You can do it via the ArgoCD UI.
- You can now deploy the charts, and you should be able to access the site via the ingress host you set.
