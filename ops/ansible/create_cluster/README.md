### Configuring Ansible :

- Edit the `inventory.ini` file :

  - Set the environment you want to deploy in the `environment_deployment`
  - On the first line, replace the master's IP with one of your machine, and indicate the path to the private key you used during allocation.
  - Do the same for all the other machines, creating or removing lines to match the number of instances you have.
  - For the k3d-master role, put the name of your first machine in the inventory
  - For the k3d-node role, put the name of all the others machines.

### Running the script :

Make sure you have ansible package installed on your machine, then run `ansible-playground main.yaml`.

Let the script run, and you should be all set !

The script will copy the kubeconfig file to a `~/.kube/config_polycode_<environment>` file. You still need to manually update the IP address to point to the master.
