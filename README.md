# HireFlow — Azure Self-Managed Kubernetes + GitOps Deployment Guide

> **Purpose:** This README is a complete, beginner-friendly, step-by-step runbook for deploying the HireFlow project on Azure using Terraform, a self-managed Kubernetes cluster with `kubeadm`, and Argo CD GitOps.
>
> **Important:** Replace every placeholder such as `<CONTROLLER_PUBLIC_IP>`, `<TOKEN>`, `<CA_CERT_HASH>`, `<REPO_URL>`, and `<SECRET_VALUE>` with your actual values. Do not commit passwords, API tokens, private keys, or other secrets to Git.


## Table of Contents

1. [Architecture and Deployment Flow](#1-architecture-and-deployment-flow)
2. [Repository Names](#2-repository-names)
3. [Prerequisites](#3-prerequisites)
4. [Repository Configuration — GitHub Token](#4-repository-configuration--github-token)
5. [GitHub Actions Repository Secret](#5-github-actions-repository-secret)
6. [Create the Azure SSH PEM Key](#6-create-the-azure-ssh-pem-key)
7. [Clone the Terraform Infrastructure Repository](#7-clone-the-terraform-infrastructure-repository)
8. [Configure Terraform for Azure](#8-configure-terraform-for-azure)
9. [Create Azure Infrastructure](#9-create-azure-infrastructure)
10. [Read Terraform Outputs](#10-read-terraform-outputs)
11. [SSH to the Controller Node](#11-ssh-to-the-controller-node)
12. [Install Kubernetes on the Controller](#12-install-kubernetes-on-the-controller)
13. [Save the Kubeadm Join Information](#13-save-the-kubeadm-join-information)
14. [SSH to the Worker Nodes](#14-ssh-to-the-worker-nodes)
15. [Configure and Join Worker Nodes](#15-configure-and-join-worker-nodes)
16. [Verify the Kubernetes Cluster](#16-verify-the-kubernetes-cluster)
17. [Clone and Deploy HireFlow](#17-clone-and-deploy-hireflow)
18. [Install Argo CD](#18-install-argo-cd)
19. [Configure the Argo CD Application](#19-configure-the-argo-cd-application)
20. [Get Argo CD Login Information](#20-get-argo-cd-login-information)
21. [Login to Argo CD](#21-login-to-argo-cd)
22. [Verify HireFlow Deployment](#22-verify-hireflow-deployment)
23. [Kubernetes Troubleshooting Commands](#23-kubernetes-troubleshooting-commands)
24. [The 15 Most Important Commands](#24-the-15-most-important-commands)
25. [Common Problems and Fixes](#25-common-problems-and-fixes)
26. [Deployment Checklist](#26-deployment-checklist)
27. [Security Notes](#27-security-notes)

---

# 1. Architecture and Deployment Flow

The overall deployment follows this sequence:

```text
GitHub Repositories
       |
       | Clone
       v
+---------------------------+
| azure-sm-k8s-iaac         |
| Terraform                 |
+---------------------------+
       |
       | terraform apply
       v
+--------------------------------------+
| Azure                                |
|                                      |
|  Resource Group                      |
|       |                              |
|       +-- Controller VM              |
|       |       Private + Public IP    |
|       |                              |
|       +-- Worker VM(s)               |
|               Private + Public IP    |
+--------------------------------------+
       |
       | SSH
       v
+---------------------------+
| Controller Node           |
| self-managed-k8s-         |
| automation                |
| controller.sh             |
+---------------------------+
       |
       | kubeadm init
       | Token + CA Hash
       v
+---------------------------+
| Worker Node(s)            |
| worker.sh                 |
| kubeadm join              |
+---------------------------+
       |
       | kubectl
       v
+---------------------------+
| Kubernetes Cluster        |
| Controller + Workers      |
+---------------------------+
       |
       | Clone
       v
+---------------------------+
| hireflow-gitops-latest    |
| deploy.sh                 |
| application.yaml          |
| install-argocd.sh         |
+---------------------------+
       |
       v
+---------------------------+
| Argo CD                   |
| GitOps                    |
+---------------------------+
       |
       v
+---------------------------+
| HireFlow Namespace        |
| Application + Database    |
| Services / Pods           |
+---------------------------+
```

### Deployment order

Always follow this order:

1. Configure GitHub access/token if required.
2. Create the Azure SSH PEM key.
3. Clone `azure-sm-k8s-iaac`.
4. Configure Terraform.
5. Run `terraform init`.
6. Run `terraform plan`.
7. Run `terraform apply`.
8. Get controller and worker IP addresses.
9. SSH to the controller.
10. Clone `self-managed-k8s-automation`.
11. Run `controller.sh`.
12. Save the kubeadm token and CA certificate hash.
13. SSH to each worker.
14. Clone `self-managed-k8s-automation`.
15. Update `worker.sh`.
16. Run `worker.sh`.
17. Verify the Kubernetes nodes.
18. Clone `hireflow-gitops-latest`.
19. Run `deploy.sh`.
20. Install/configure Argo CD.
21. Update `application.yaml` with the correct repository.
22. Apply `application.yaml`.
23. Login to Argo CD.
24. Verify HireFlow pods, services, ingress, logs, and events.

---

# 2. Repository Names

The project uses the following repositories.

## 2.1 First Repository — Azure Infrastructure

```text
azure-sm-k8s-iaac
```

**Purpose:** Creates the Azure infrastructure using Terraform.

Typical responsibility:

- Azure Resource Group
- Network resources
- Controller VM
- Worker VM(s)
- Public/private IP configuration
- Other infrastructure defined by the Terraform code

---

## 2.2 Second Repository — Kubernetes Automation

```text
self-managed-k8s-automation
```

**Purpose:** Installs and configures the self-managed Kubernetes cluster.

Typical structure:

```text
self-managed-k8s-automation/
└── azure/
    ├── controller.sh
    └── worker.sh
```

`controller.sh` is used on the controller node.

`worker.sh` is used on worker nodes.

---

## 2.3 Third Repository — HireFlow GitOps

```text
hireflow-gitops-latest
```

**Purpose:** Contains the HireFlow deployment/GitOps configuration.

It may contain files such as:

```text
deploy.sh
install-argocd.sh
application.yaml
```

It can also contain Kubernetes YAML files, application configuration, database configuration, namespaces, services, deployments, ingress, and other GitOps resources depending on the repository version.

---

## 2.4 Optional Fourth Repository

```text
hireflow-gitops-Thakur
```

Use this repository only if the project requires it.

If your workflow requires cloning the repository, clone it in the same way as the other repositories.

---

# 3. Prerequisites

Before starting, make sure you have:

### Local machine

- Git
- Terraform
- Azure CLI
- SSH client
- A text editor such as `vim` or `nano`
- Access to the required GitHub repositories
- An Azure account/subscription
- Correct Azure credentials
- Required GitHub permissions

### Azure

You need:

- Azure subscription
- Permission to create resources
- Permission to create virtual machines
- Permission to create networking resources
- Enough quota for the required VMs

### GitHub

You need:

- Repository access
- Permission to create/use a Personal Access Token if required
- Permission to configure repository secrets if the workflow requires GitHub Actions

---

# 4. Repository Configuration — GitHub Token

This section describes how to create a GitHub fine-grained Personal Access Token.

> **Security warning:** Treat the token like a password. Never paste it into Git files, Terraform files, screenshots, chat messages, or public repositories.

## Step 1 — Open GitHub

Login to GitHub.

## Step 2 — Open your profile

Click:

```text
Profile
```

## Step 3 — Open Settings

Click:

```text
Settings
```

## Step 4 — Open Developer Settings

Go to:

```text
Developer settings
```

## Step 5 — Open Personal Access Tokens

Select:

```text
Personal access tokens
```

Then select:

```text
Fine-grained tokens
```

## Step 6 — Generate a new token

Click:

```text
Generate new token
```

GitHub may ask you to verify your password or another authentication method.

Complete the verification.

## Step 7 — Enter token details

Enter:

```text
Token name:
<YOUR_TOKEN_NAME>

Description:
<YOUR_TOKEN_DESCRIPTION>
```

Use a meaningful name, for example:

```text
HireFlow-DevOps-Automation
```

## Step 8 — Select repository access

Choose:

```text
Only select repositories
```

Then select the required repository.

For example:

```text
DevOps branch/repository
```

Use the exact repository that your workflow requires.

## Step 9 — Configure permissions

Under repository permissions, provide only the permissions required by your workflow.

The original project configuration specifies:

```text
Administration -> Read-only
Contents       -> Read and write
```

Do not grant additional permissions unless your workflow actually requires them.

## Step 10 — Generate the token

Click:

```text
Generate token
```

Copy the token immediately if GitHub only displays it once.

Store it securely.

---

# 5. GitHub Actions Repository Secret

If the deployment uses GitHub Actions, add the required token as a repository secret.

## Step 1

Open the required GitHub repository.

## Step 2

Click:

```text
Settings
```

## Step 3

Go to:

```text
Secrets and variables
```

## Step 4

Select:

```text
Actions
```

## Step 5

Click:

```text
New repository secret
```

## Step 6

Enter the secret

Example:

```text
Name:
GITHUB_TOKEN_CUSTOM

Secret:
<YOUR_TOKEN>
```

Use the exact secret name expected by your workflow.

## Step 7

Save

Click:

```text
Add secret
```

### Important

Do not put the actual token directly into:

```text
*.yaml
*.tf
*.tfvars
*.sh
README.md
```

unless the value is intentionally non-sensitive.

---

# 6. Create the Azure SSH PEM Key

The PEM private key is used to SSH into the Azure VMs.

## Step 1 — Create the key

Run:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/my-key
```

When prompted for a passphrase, follow your organization's security policy.

This normally creates:

```text
~/.ssh/my-key
~/.ssh/my-key.pub
```

The private key is:

```text
~/.ssh/my-key
```

The public key is:

```text
~/.ssh/my-key.pub
```

If you specifically need the private key to have a `.pem` filename, you can use:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/my-key.pem
```

That produces:

```text
~/.ssh/my-key.pem
~/.ssh/my-key.pem.pub
```

Use the filename that matches your Terraform configuration.

## Step 2 — Give the private key secure permissions

For a `.pem` key:

```bash
chmod 400 ~/.ssh/my-key.pem
```

If your key is named `my-key` instead:

```bash
chmod 400 ~/.ssh/my-key
```

## Step 3 — Check the key

```bash
ls -l ~/.ssh/my-key*
```

You should see the private and public key files.

### Never commit the private key

Do NOT upload:

```text
my-key
my-key.pem
```

to GitHub.

---

# 7. Clone the Terraform Infrastructure Repository

Go to the directory where you keep your DevOps projects.

Then clone:

```bash
git clone <AZURE_SM_K8S_IAAC_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/<YOUR_USERNAME>/azure-sm-k8s-iaac.git
```

Enter the directory:

```bash
cd azure-sm-k8s-iaac
```

Check the files:

```bash
ls
```

You should see the Terraform files used by the project.

Typical Terraform files include:

```text
main.tf
variables.tf
terraform.tfvars
outputs.tf
providers.tf
```

The exact files depend on your repository.

---

# 8. Configure Terraform for Azure

Before running Terraform, inspect the configuration.

## Step 1 — Check Terraform files

Run:

```bash
ls -la
```

Then inspect the important files:

```bash
cat main.tf
cat variables.tf
cat outputs.tf
```

If `terraform.tfvars` exists:

```bash
cat terraform.tfvars
```

> **Security:** If `terraform.tfvars` contains passwords, tokens, private data, or secrets, do not paste or commit those values publicly.

---

## Step 2 — Configure the SSH public key

The Azure VM configuration needs your **public** SSH key.

Your public key is usually:

```text
~/.ssh/my-key.pem.pub
```

or:

```text
~/.ssh/my-key.pub
```

Check it:

```bash
cat ~/.ssh/my-key.pem.pub
```

Copy the complete public key.

It normally starts with something similar to:

```text
ssh-rsa AAAA...
```

Add the public key to the Terraform variable/configuration expected by your repository.

For example, if the repository expects:

```hcl
ssh_public_key = "YOUR_PUBLIC_KEY"
```

then put the public key there.

**Do not put the private key in Terraform.**

---

## Step 3 — Check Azure variables

Your Terraform configuration may require values such as:

```hcl
project_id = "..."
region     = "..."
zone       = "..."
```

For Azure, use the variable names actually defined by your repository.

Check:

```bash
cat variables.tf
```

Then configure:

```text
subscription ID
resource group name
location
VM size
admin username
SSH public key
network configuration
```

Use the exact variable names required by your code.

---

# 9. Create Azure Infrastructure

## Step 1 — Authenticate to Azure

If required:

```bash
az login
```

List subscriptions:

```bash
az account list
```

Select the required subscription:

```bash
az account set --subscription "<SUBSCRIPTION_ID>"
```

Verify:

```bash
az account show
```

---

## Step 2 — Initialize Terraform

From inside:

```text
azure-sm-k8s-iaac
```

run:

```bash
terraform init
```

### Purpose

`terraform init` initializes the Terraform working directory and downloads the required providers/modules.

---

## Step 3 — Validate the configuration

Run:

```bash
terraform validate
```

Expected result:

```text
Success! The configuration is valid.
```

---

## Step 4 — Format Terraform files

Run:

```bash
terraform fmt
```

To check formatting recursively:

```bash
terraform fmt -recursive
```

---

## Step 5 — Create a plan

Run:

```bash
terraform plan
```

### Purpose

`terraform plan` shows what Terraform intends to create, modify, or destroy.

Review the plan carefully.

Make sure the resources are correct before continuing.

---

## Step 6 — Apply the infrastructure

Run:

```bash
terraform apply
```

Terraform will ask for confirmation.

Review the plan and type:

```text
yes
```

Terraform will create the Azure resources.

---

# 10. Read Terraform Outputs

After a successful `terraform apply`, Terraform may display outputs similar to:

```text
controller_private_ip = "10.x.x.x"
controller_public_ip  = "x.x.x.x"
resource_group_name  = "resource-group-name"
worker1_private_ip    = "10.x.x.x"
worker1_public_ip     = "x.x.x.x"
```

The exact output names depend on your Terraform code.

To display outputs again:

```bash
terraform output
```

To get one specific output:

```bash
terraform output controller_public_ip
```

You can also inspect the output configuration:

```bash
cat outputs.tf
```

---

# 11. SSH to the Controller Node

You need:

- Controller public IP
- Private PEM key
- Azure VM username

The original configuration uses:

```text
azureuser
```

Example:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>
```

Example:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@20.x.x.x
```

If SSH complains about key permissions:

```bash
chmod 400 ~/.ssh/my-key.pem
```

Then retry:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>
```

---

# 12. Install Kubernetes on the Controller

Once connected to the controller VM:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>
```

## Step 1 — Clone the Kubernetes automation repository

Run:

```bash
git clone <SELF_MANAGED_K8S_AUTOMATION_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/<YOUR_USERNAME>/self-managed-k8s-automation.git
```

Enter the repository:

```bash
cd self-managed-k8s-automation
```

Check files:

```bash
ls
```

Enter the Azure directory:

```bash
cd azure
```

Check:

```bash
ls -l
```

You should find the controller and worker configuration.

---

## Step 2 — Run the controller script

Run:

```bash
sudo bash controller.sh
```

The script should install/configure the Kubernetes controller according to the repository.

Depending on the script, it may:

- Install container runtime components
- Install Kubernetes packages
- Configure required kernel/network settings
- Initialize the cluster
- Configure kubeconfig
- Run `kubeadm init`
- Generate a worker join token
- Generate the CA certificate hash

---

# 13. Save the Kubeadm Join Information

After the controller setup completes, you need the worker join information.

It normally looks conceptually like:

```bash
sudo kubeadm join <CONTROLLER_PRIVATE_IP>:6443 \
    --token <TOKEN> \
    --discovery-token-ca-cert-hash sha256:<CA_CERT_HASH>
```

Your script may print the complete command.

## Save these values

You need:

```text
CONTROLLER_PRIVATE_IP
TOKEN
CA_CERT_HASH
```

Example:

```text
CONTROLLER_PRIVATE_IP = 10.0.1.10

TOKEN = abcdef.0123456789abcdef

CA_CERT_HASH = sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Important

Do not share these values publicly.

The token is sensitive cluster bootstrap information.

---

# 14. SSH to the Worker Nodes

Open a **second terminal** on your local machine.

Use the worker public IP.

Example:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<WORKER1_PUBLIC_IP>
```

Example:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@20.x.x.x
```

Repeat for every worker node.

---

# 15. Configure and Join Worker Nodes

## Step 1 — Clone the automation repository

On the worker node:

```bash
git clone <SELF_MANAGED_K8S_AUTOMATION_REPOSITORY_URL>
```

Enter the repository:

```bash
cd self-managed-k8s-automation
```

Enter the Azure directory:

```bash
cd azure
```

Check files:

```bash
ls -l
```

---

## Step 2 — Edit `worker.sh`

Open:

```bash
vim worker.sh
```

or:

```bash
nano worker.sh
```

Find the placeholders for:

```text
<CONTROLLER_PRIVATE_IP>
<TOKEN>
<CA_CERT_HASH>
```

Replace them with the actual values obtained from the controller.

For example:

```text
CONTROLLER_PRIVATE_IP
        |
        v
10.x.x.x

TOKEN
        |
        v
abcdef.0123456789abcdef

CA_CERT_HASH
        |
        v
sha256:xxxxxxxx...
```

### If using Vim

Press:

```text
i
```

to enter insert mode.

Make your changes.

Then press:

```text
ESC
```

Type:

```text
:wq
```

Press:

```text
ENTER
```

---

## Step 3 — Run the worker script

Run:

```bash
sudo bash worker.sh
```

The worker should join the Kubernetes cluster.

---

## Step 4 — Repeat for additional workers

For Worker 2, Worker 3, etc.:

1. SSH to the worker.
2. Clone `self-managed-k8s-automation`.
3. Enter `azure`.
4. Update `worker.sh`.
5. Run:

```bash
sudo bash worker.sh
```

---

# 16. Verify the Kubernetes Cluster

Go back to the controller.

If necessary:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>
```

Run:

```bash
kubectl get nodes
```

This shows the Kubernetes nodes and their status.

Example:

```text
NAME           STATUS   ROLES           AGE
controller     Ready    control-plane   ...
worker1        Ready    <none>          ...
worker2        Ready    <none>          ...
```

The most important status is:

```text
Ready
```

---

## Check detailed node information

```bash
kubectl get nodes -o wide
```

---

## Check cluster information

```bash
kubectl cluster-info
```

---

## Check namespaces

```bash
kubectl get namespaces
```

At this point, the self-managed Kubernetes cluster should be ready.

---

# 17. Clone and Deploy HireFlow

On the controller node, clone the GitOps repository.

```bash
git clone <HIREFLOW_GITOPS_LATEST_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/<YOUR_USERNAME>/hireflow-gitops-latest.git
```

Enter the repository:

```bash
cd hireflow-gitops-latest
```

Check the files:

```bash
ls -la
```

---

## Step 1 — Make the deployment script executable

Run:

```bash
chmod +x deploy.sh
```

---

## Step 2 — Run the deployment script

Try:

```bash
bash deploy.sh
```

If the script requires elevated privileges:

```bash
sudo bash deploy.sh
```

The script may:

- Create the HireFlow namespace
- Apply Kubernetes YAML files
- Create application resources
- Create database resources/configuration
- Create services
- Create other required project resources

The exact resources depend on the contents of `deploy.sh` and the repository YAML files.

---

## Step 3 — Check the namespace

Run:

```bash
kubectl get namespaces
```

Look for:

```text
hireflow
```

Then:

```bash
kubectl get pods -n hireflow
```

---

# 18. Install Argo CD

The GitOps repository contains:

```text
install-argocd.sh
```

From:

```text
hireflow-gitops-latest
```

run:

```bash
chmod +x install-argocd.sh
```

Then:

```bash
bash install-argocd.sh
```

If required:

```bash
sudo bash install-argocd.sh
```

The script may install Argo CD and print commands/output required to access it.

---

# 19. Configure the Argo CD Application

The repository contains:

```text
application.yaml
```

Before applying it, inspect it:

```bash
cat application.yaml
```

or:

```bash
vim application.yaml
```

## Important — Update the repository name

Make sure the Git repository configured in `application.yaml` points to the correct GitOps repository.

For example, the configuration may reference:

```text
hireflow-gitops-latest
```

If your actual repository is different, update it accordingly.

Also verify:

- Repository URL
- Target revision/branch
- Kubernetes destination server
- Namespace
- Application path

Do not blindly copy these values from another environment.

---

## Apply the Argo CD Application

Run:

```bash
kubectl apply -f application.yaml
```

This creates the Argo CD Application resource.

Then check:

```bash
kubectl get applications -A
```

If the Argo CD CRD is installed and your setup supports it, you can also inspect the application in the Argo CD UI.

---

# 20. Get Argo CD Login Information

Check Argo CD pods:

```bash
kubectl get pods -n argocd
```

Check Argo CD services:

```bash
kubectl get svc -n argocd
```

The `install-argocd.sh` script may provide the access URL/IP and login instructions.

If you need the initial admin password in a standard Argo CD installation, a common command is:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

Then press Enter.

> If your installation script uses a different authentication setup, follow the credentials/output provided by that script.

---

# 21. Login to Argo CD

The Argo CD script may provide an IP or URL.

Open the URL in Chrome.

If the browser shows a certificate warning for a development/self-signed HTTPS endpoint:

1. Click **Advanced**.
2. Continue only if you recognize and trust the endpoint.
3. Enter the Argo CD username.
4. Enter the password.

The default username in a standard installation is commonly:

```text
admin
```

Use the actual credentials configured by your environment.

---

# 22. Verify HireFlow Deployment

After logging into Argo CD, check the application.

You want to see the application moving toward:

```text
Synced
Healthy
```

The exact status depends on the application.

---

## Check HireFlow pods

```bash
kubectl get pods -n hireflow
```

For more information:

```bash
kubectl get pods -n hireflow -o wide
```

---

## Check services

```bash
kubectl get svc -n hireflow
```

More details:

```bash
kubectl get svc -n hireflow -o wide
```

---

## Check ingress

```bash
kubectl get ingress -n hireflow
```

More details:

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

---

## Check deployments

```bash
kubectl get deployment -n hireflow
```

Check rollout:

```bash
kubectl rollout status deployment/<DEPLOYMENT_NAME> -n hireflow
```

---

# 23. Kubernetes Troubleshooting Commands

This section is the main troubleshooting reference.

---

## 23.1 Cluster & Nodes

### Show cluster information

```bash
kubectl cluster-info
```

### Show all nodes

```bash
kubectl get nodes
```

### Show nodes with IP information

```bash
kubectl get nodes -o wide
```

### Describe a node

```bash
kubectl describe node <NODE_NAME>
```

### Show namespaces

```bash
kubectl get namespaces
```

---

# Pods

## Show HireFlow pods

```bash
kubectl get pods -n hireflow
```

## Show pods with node/IP information

```bash
kubectl get pods -n hireflow -o wide
```

## Show pods in every namespace

```bash
kubectl get pods -A
```

## Describe a pod

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

## Delete a pod

```bash
kubectl delete pod <POD_NAME> -n hireflow
```

> If the pod belongs to a Deployment, Kubernetes normally creates a replacement pod automatically.

---

# Logs ⭐

Logs are one of the most important tools for troubleshooting applications.

## Show logs

```bash
kubectl logs <POD_NAME> -n hireflow
```

## Follow live logs

```bash
kubectl logs -f <POD_NAME> -n hireflow
```

## Show logs for a specific container

```bash
kubectl logs <POD_NAME> -c <CONTAINER_NAME> -n hireflow
```

## Show logs from the previous container instance

```bash
kubectl logs <POD_NAME> --previous -n hireflow
```

This is especially useful after:

- CrashLoopBackOff
- Container restart
- Application crash
- Startup failure

---

# Services

## Show HireFlow services

```bash
kubectl get svc -n hireflow
```

## Show services with additional information

```bash
kubectl get svc -n hireflow -o wide
```

## Describe a service

```bash
kubectl describe svc <SERVICE_NAME> -n hireflow
```

---

# Ingress

## Show ingress resources

```bash
kubectl get ingress -n hireflow
```

## Describe ingress

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

---

# ConfigMaps & Secrets

## Show ConfigMaps

```bash
kubectl get configmap -n hireflow
```

## Describe a ConfigMap

```bash
kubectl describe configmap <CONFIGMAP_NAME> -n hireflow
```

## Show Secrets

```bash
kubectl get secrets -n hireflow
```

## Describe a Secret

```bash
kubectl describe secret <SECRET_NAME> -n hireflow
```

> Kubernetes Secret metadata can be viewed with `describe`, but avoid exposing secret values in terminal screenshots, logs, Git repositories, or chat.

---

# Events

Events often explain why a resource is failing.

## Show HireFlow events

```bash
kubectl get events -n hireflow
```

## Show events sorted by latest timestamp

```bash
kubectl get events -n hireflow --sort-by='.lastTimestamp'
```

## Show events across all namespaces

```bash
kubectl get events -A --sort-by='.lastTimestamp'
```

---

# YAML / Resource Details

## Get pod YAML

```bash
kubectl get pod <POD_NAME> -n hireflow -o yaml
```

## Get deployment YAML

```bash
kubectl get deployment <DEPLOYMENT_NAME> -n hireflow -o yaml
```

## Get service YAML

```bash
kubectl get svc <SERVICE_NAME> -n hireflow -o yaml
```

YAML output is useful for checking:

- Environment variables
- Image
- Ports
- Labels
- Selectors
- Volumes
- Probes
- Resource requests/limits
- Configuration

---

# 24. The 15 Most Important Commands

If you are preparing for production troubleshooting or a DevOps interview, remember these first.

## 1. Check nodes

```bash
kubectl get nodes
```

## 2. Check all pods

```bash
kubectl get pods -A
```

## 3. Check HireFlow pods with details

```bash
kubectl get pods -o wide -n hireflow
```

## 4. Describe a pod

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

## 5. Check pod logs

```bash
kubectl logs <POD_NAME> -n hireflow
```

## 6. Follow live logs

```bash
kubectl logs -f <POD_NAME> -n hireflow
```

## 7. Check services

```bash
kubectl get svc -n hireflow
```

## 8. Describe a service

```bash
kubectl describe svc <SERVICE_NAME> -n hireflow
```

## 9. Check ingress

```bash
kubectl get ingress -n hireflow
```

## 10. Describe ingress

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

## 11. Check events

```bash
kubectl get events -n hireflow
```

## 12. Check deployments

```bash
kubectl get deployment -n hireflow
```

## 13. Check deployment rollout

```bash
kubectl rollout status deployment/<DEPLOYMENT_NAME> -n hireflow
```

## 14. Restart a deployment

```bash
kubectl rollout restart deployment/<DEPLOYMENT_NAME> -n hireflow
```

## 15. Enter a running container

```bash
kubectl exec -it <POD_NAME> -n hireflow -- /bin/sh
```

If the container has Bash:

```bash
kubectl exec -it <POD_NAME> -n hireflow -- /bin/bash
```

---

# 25. Common Problems and Fixes

## Problem 1 — SSH permission denied

### Error

```text
Permission denied (publickey)
```

### Check

Make sure the private key is correct:

```bash
ls -l ~/.ssh/my-key.pem
```

Set permissions:

```bash
chmod 400 ~/.ssh/my-key.pem
```

Then:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<PUBLIC_IP>
```

Also verify that the username and public key configured on the VM are correct.

---

## Problem 2 — Terraform initialization fails

Run:

```bash
terraform init
```

If there is a provider/module problem, inspect:

```bash
terraform version
```

Then:

```bash
terraform validate
```

Check your Terraform configuration and network access.

---

## Problem 3 — Terraform plan wants to create unexpected resources

Do not immediately run:

```bash
terraform apply
```

First inspect:

```bash
terraform plan
```

Check:

```bash
terraform.tfvars
main.tf
variables.tf
modules/
```

Confirm that you are using the correct Azure subscription and environment.

---

## Problem 4 — Worker is not joining Kubernetes

On the worker, check:

```bash
sudo systemctl status kubelet
```

Check connectivity to the controller:

```bash
ping <CONTROLLER_PRIVATE_IP>
```

Check that Kubernetes API port `6443` is reachable according to your network/security configuration.

Verify that the join information is correct:

```text
CONTROLLER_PRIVATE_IP
TOKEN
CA_CERT_HASH
```

Then inspect kubelet logs:

```bash
sudo journalctl -u kubelet -xe
```

---

## Problem 5 — Node is NotReady

Run:

```bash
kubectl get nodes
```

Then:

```bash
kubectl describe node <NODE_NAME>
```

Check conditions and events.

Also inspect kubelet:

```bash
sudo systemctl status kubelet
```

and:

```bash
sudo journalctl -u kubelet -xe
```

---

## Problem 6 — Pod is Pending

Run:

```bash
kubectl get pods -n hireflow
```

Then:

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

Pay attention to the **Events** section.

Common causes include:

- Insufficient CPU/memory
- Node selector mismatch
- Taints/tolerations
- Missing volumes
- PVC not bound
- Image pull issues
- Scheduling constraints

---

## Problem 7 — Pod is CrashLoopBackOff

Run:

```bash
kubectl logs <POD_NAME> -n hireflow
```

Then:

```bash
kubectl logs <POD_NAME> --previous -n hireflow
```

Also:

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

Look for:

- Application startup error
- Missing environment variables
- Database connection failure
- Wrong credentials
- Wrong port
- Missing configuration
- Failed health probe

---

## Problem 8 — ImagePullBackOff / ErrImagePull

Run:

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

Check the image name.

You can also inspect:

```bash
kubectl get deployment <DEPLOYMENT_NAME> -n hireflow -o yaml
```

Common causes:

- Incorrect image name
- Incorrect tag
- Private registry authentication missing
- Image does not exist
- Registry unavailable

---

## Problem 9 — Service is not working

Check:

```bash
kubectl get svc -n hireflow
```

Then:

```bash
kubectl describe svc <SERVICE_NAME> -n hireflow
```

Check endpoints:

```bash
kubectl get endpoints -n hireflow
```

Also check pod labels:

```bash
kubectl get pods -n hireflow --show-labels
```

The Service selector must match the appropriate pod labels.

---

## Problem 10 — Ingress is not working

Run:

```bash
kubectl get ingress -n hireflow
```

Then:

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

Check:

- Ingress controller
- Hostname
- Backend service
- Service port
- DNS
- External IP/address
- Events

---

## Problem 11 — Argo CD application is OutOfSync

Check the application in the Argo CD UI.

Also verify:

```text
Repository URL
Branch / revision
Path
Destination cluster
Namespace
```

Check the Kubernetes resource state:

```bash
kubectl get pods -n hireflow
kubectl get svc -n hireflow
kubectl get deployment -n hireflow
```

Review the Git repository for incorrect YAML or configuration.

---

# 26. Deployment Checklist

Use this checklist from beginning to end.

## GitHub

- [ ] GitHub access confirmed
- [ ] Required repositories available
- [ ] Fine-grained token created if required
- [ ] Correct repository selected
- [ ] Required permissions configured
- [ ] Repository secret added if required
- [ ] Token not committed to Git

## SSH Key

- [ ] SSH key generated
- [ ] Public key available
- [ ] Public key added to Terraform configuration
- [ ] Private key permission set to `400`
- [ ] Private key not uploaded to GitHub

## Azure

- [ ] Azure login completed
- [ ] Correct subscription selected
- [ ] Terraform repository cloned
- [ ] Terraform variables configured
- [ ] `terraform init` completed
- [ ] `terraform validate` successful
- [ ] `terraform plan` reviewed
- [ ] `terraform apply` completed
- [ ] Controller public IP available
- [ ] Controller private IP available
- [ ] Worker public IP available
- [ ] Worker private IP available

## Controller

- [ ] SSH to controller successful
- [ ] `self-managed-k8s-automation` cloned
- [ ] `azure` directory entered
- [ ] `controller.sh` executed
- [ ] Kubernetes initialized
- [ ] Kubeadm token saved
- [ ] CA certificate hash saved
- [ ] Controller private IP saved

## Workers

- [ ] SSH to Worker 1 successful
- [ ] Automation repository cloned
- [ ] `worker.sh` updated
- [ ] Controller private IP updated
- [ ] Token updated
- [ ] CA certificate hash updated
- [ ] `worker.sh` executed
- [ ] Worker status becomes `Ready`
- [ ] Same process repeated for additional workers

## Kubernetes

- [ ] `kubectl get nodes` works
- [ ] Controller is `Ready`
- [ ] Workers are `Ready`
- [ ] `kubectl cluster-info` works
- [ ] HireFlow namespace exists

## HireFlow

- [ ] `hireflow-gitops-latest` cloned
- [ ] `deploy.sh` executable
- [ ] `deploy.sh` executed
- [ ] HireFlow pods checked
- [ ] Services checked
- [ ] Database resources checked if applicable

## Argo CD

- [ ] `install-argocd.sh` executable
- [ ] Argo CD installed
- [ ] Argo CD pods running
- [ ] `application.yaml` reviewed
- [ ] Correct repository configured
- [ ] `kubectl apply -f application.yaml` completed
- [ ] Argo CD URL obtained
- [ ] Login credentials obtained securely
- [ ] Application visible
- [ ] Application synchronized/healthy

## Final verification

- [ ] Pods are Running/Ready
- [ ] Services have correct endpoints
- [ ] Ingress is configured
- [ ] Application logs are healthy
- [ ] No critical Kubernetes events
- [ ] Database connection works
- [ ] HireFlow application is accessible

---

# 27. Security Notes

## Never commit these to Git

Do not commit:

```text
*.pem
private SSH keys
GitHub Personal Access Tokens
passwords
database passwords
API keys
cloud credentials
Kubernetes bootstrap tokens
private certificates
```

Add sensitive files to `.gitignore` where appropriate.

Example:

```gitignore
*.pem
*.key
.env
.terraform/
terraform.tfstate
terraform.tfstate.*
```

Be careful with Terraform state because it can contain sensitive values.

---

## Protect GitHub tokens

If a token is accidentally exposed:

1. Revoke it immediately in GitHub.
2. Create a new token with minimum required permissions.
3. Update the repository secret.
4. Check Git history for the leaked token.
5. Remove the secret from future commits.
6. Consider rotating any other credentials that may have been exposed.

---

## Protect Azure SSH keys

Never upload your private PEM key to GitHub.

Correct:

```text
Local machine
    |
    +-- ~/.ssh/my-key.pem     <- PRIVATE
    |
    +-- ~/.ssh/my-key.pem.pub <- PUBLIC
```

Terraform/Azure receives the **public** key.

SSH uses the **private** key.

---

# Quick End-to-End Command Summary

This is the short version after you understand the full procedure.

## 1. Create SSH key

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/my-key.pem
chmod 400 ~/.ssh/my-key.pem
ls -l ~/.ssh/my-key*
```

## 2. Clone infrastructure

```bash
git clone <AZURE_SM_K8S_IAAC_REPOSITORY_URL>
cd azure-sm-k8s-iaac
```

## 3. Configure Azure/Terraform

```bash
az login
az account set --subscription "<SUBSCRIPTION_ID>"
terraform init
terraform validate
terraform plan
terraform apply
```

## 4. Get IPs

```bash
terraform output
```

## 5. SSH to controller

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>
```

## 6. Install controller

```bash
git clone <SELF_MANAGED_K8S_AUTOMATION_REPOSITORY_URL>
cd self-managed-k8s-automation/azure
sudo bash controller.sh
```

Save:

```text
CONTROLLER_PRIVATE_IP
TOKEN
CA_CERT_HASH
```

## 7. SSH to worker

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<WORKER_PUBLIC_IP>
```

## 8. Configure worker

```bash
git clone <SELF_MANAGED_K8S_AUTOMATION_REPOSITORY_URL>
cd self-managed-k8s-automation/azure
vim worker.sh
```

Replace:

```text
<CONTROLLER_PRIVATE_IP>
<TOKEN>
<CA_CERT_HASH>
```

Then:

```bash
sudo bash worker.sh
```

## 9. Verify cluster

On controller:

```bash
kubectl get nodes
kubectl get nodes -o wide
kubectl cluster-info
```

## 10. Deploy HireFlow

```bash
git clone <HIREFLOW_GITOPS_LATEST_REPOSITORY_URL>
cd hireflow-gitops-latest
chmod +x deploy.sh
bash deploy.sh
```

If required:

```bash
sudo bash deploy.sh
```

## 11. Install Argo CD

```bash
chmod +x install-argocd.sh
bash install-argocd.sh
```

If required:

```bash
sudo bash install-argocd.sh
```

## 12. Configure Argo CD application

Edit:

```bash
vim application.yaml
```

Verify the repository name/URL and other application settings.

Apply:

```bash
kubectl apply -f application.yaml
```

## 13. Get Argo CD password if using standard initial admin secret

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

## 14. Verify HireFlow

```bash
kubectl get pods -n hireflow
kubectl get pods -n hireflow -o wide
kubectl get svc -n hireflow
kubectl get ingress -n hireflow
kubectl get deployment -n hireflow
kubectl get events -n hireflow --sort-by='.lastTimestamp'
```

---

# Final Operational Flow

```text
1. GitHub Token / Secret
        |
        v
2. SSH PEM Key
        |
        v
3. Clone azure-sm-k8s-iaac
        |
        v
4. Configure Terraform
        |
        v
5. terraform init
        |
        v
6. terraform validate
        |
        v
7. terraform plan
        |
        v
8. terraform apply
        |
        v
9. Get Controller + Worker IPs
        |
        v
10. SSH Controller
        |
        v
11. Clone self-managed-k8s-automation
        |
        v
12. controller.sh
        |
        v
13. Get TOKEN + CA HASH
        |
        v
14. SSH Worker
        |
        v
15. Update worker.sh
        |
        v
16. worker.sh
        |
        v
17. kubectl get nodes
        |
        v
18. Clone hireflow-gitops-latest
        |
        v
19. deploy.sh
        |
        v
20. install-argocd.sh
        |
        v
21. Update application.yaml
        |
        v
22. kubectl apply -f application.yaml
        |
        v
23. Login to Argo CD
        |
        v
24. Verify Synced / Healthy
        |
        v
25. Verify HireFlow Pods / Services / Ingress


# End

This README is intended to be followed from top to bottom. If a step fails, stop at that step, inspect the error, and use the troubleshooting commands in Section 25 before continuing.
