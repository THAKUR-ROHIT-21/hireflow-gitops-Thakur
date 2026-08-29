# 🚀 HireFlow — Azure + Kubernetes + GitOps

> **A complete, beginner-friendly DevOps deployment guide**
>
> **Azure Infrastructure → Self-Managed Kubernetes → HireFlow → Argo CD → GitOps**
>
> Follow this README from **top to bottom**. Every section tells you **what to do, why you are doing it, and how to verify it**.

---

## 🎯 What Are We Building?

By the end of this guide, you will have:

```text
                    ☁️ AZURE
                       │
                       ▼
              ┌─────────────────┐
              │ Terraform (IaC) │
              └────────┬────────┘
                       │
             Creates Azure VMs
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   🧠 Controller VM          ⚙️ Worker VM(s)
          │                         │
          └──────────┬──────────────┘
                     │
                     ▼
            ☸️ Kubernetes Cluster
                     │
                     ▼
               💼 HireFlow
                     │
                     ▼
                🔄 Argo CD
                     │
                     ▼
              🚀 GitOps Deployment
```

### 🏁 Final Goal

```text
Git Push
   ↓
GitHub Repository
   ↓
Argo CD detects change
   ↓
Kubernetes gets updated
   ↓
HireFlow application runs
```

---

# 🗺️ Deployment Roadmap

Think of the deployment like building a house 🏠:

| Step | What we do | Tool |
|---|---|---|
| 01 | 🔐 Prepare access | GitHub |
| 02 | 🔑 Create SSH key | SSH |
| 03 | 🏗️ Build Azure infrastructure | Terraform |
| 04 | 🧠 Create Kubernetes controller | kubeadm |
| 05 | ⚙️ Add worker nodes | kubeadm |
| 06 | 💼 Deploy HireFlow | Kubernetes |
| 07 | 🔄 Install GitOps | Argo CD |
| 08 | 🌐 Access application | Service / Ingress |
| 09 | 🔍 Troubleshoot | kubectl |

> 💡 **Golden Rule:** Don't jump ahead. Complete one stage, verify it, then continue.

---

# 📦 1. Repository Map

The HireFlow project uses these repositories:

### 🥇 Repository 1 — Infrastructure

```text
azure-sm-k8s-iaac
```

**Job:** Creates Azure infrastructure using Terraform.

```text
Terraform
   ↓
Azure Resource Group
   ↓
Network
   ↓
Controller VM
   ↓
Worker VM(s)
```

---

### 🥈 Repository 2 — Kubernetes Automation

```text
self-managed-k8s-automation
```

**Job:** Installs and configures Kubernetes.

```text
controller.sh → Controller setup
worker.sh     → Worker setup
```

---

### 🥉 Repository 3 — HireFlow GitOps

```text
hireflow-gitops-latest
```

**Job:** Deploys HireFlow and GitOps configuration.

Important files may include:

```text
deploy.sh
install-argocd.sh
application.yaml
```

---

### ⭐ Repository 4 — Optional

```text
hireflow-gitops-Thakur
```

Use this repository only when your project workflow requires it.

---

# 🧰 2. Prerequisites

Before starting, make sure you have:

### 💻 Local Machine

- [ ] Git
- [ ] Terraform
- [ ] Azure CLI
- [ ] SSH client
- [ ] Vim / Nano
- [ ] GitHub account
- [ ] Azure subscription

### ☁️ Azure

You need permission to:

- Create Resource Groups
- Create VMs
- Create networking resources
- Create public/private IPs
- Use the required Azure subscription/quota

### 🐙 GitHub

You need:

- Repository access
- Permission to create a token if required
- Permission to create repository secrets if GitHub Actions is used

---

# 🔐 3. GitHub Token Configuration

> ⚠️ **SECURITY:** A GitHub token is like a password. Never put it in Git, screenshots, Terraform files, or public chats.

## Step 3.1 — Open GitHub

Login to GitHub.

Then:

```text
Profile
   ↓
Settings
   ↓
Developer settings
   ↓
Personal access tokens
   ↓
Fine-grained tokens
```

Click:

```text
Generate new token
```

---

## Step 3.2 — Token Details

Enter:

```text
Token name:
HireFlow-DevOps-Automation

Description:
Token for HireFlow DevOps/GitOps automation
```

Use your own naming convention if required.

---

## Step 3.3 — Repository Access

Select:

```text
Only select repositories
```

Then choose the required repository.

---

## Step 3.4 — Permissions

The original project configuration specifies:

```text
Administration → Read-only
Contents       → Read and write
```

Give only the permissions actually required by your workflow.

Then:

```text
Generate token
```

📋 **Copy the token and store it securely.**

---

# 🤖 4. GitHub Actions Secret

If the project uses GitHub Actions:

```text
Repository
   ↓
Settings
   ↓
Secrets and variables
   ↓
Actions
   ↓
New repository secret
```

Example:

```text
Name:
GITHUB_TOKEN_CUSTOM

Secret:
<YOUR_TOKEN>
```

Then click:

```text
Add secret
```

### ❌ Never do this

```text
TOKEN=ghp_xxxxxxxxx
```

inside:

```text
README.md
main.tf
terraform.tfvars
deploy.sh
application.yaml
```

---

# 🔑 5. Create Azure SSH PEM Key

The SSH key lets you connect to the Azure VMs.

## Step 5.1 — Generate Key

Run:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/my-key.pem
```

You should get:

```text
~/.ssh/my-key.pem
~/.ssh/my-key.pem.pub
```

Think of them like this:

```text
🔒 my-key.pem
   = PRIVATE KEY
   = Keep secret!

🔓 my-key.pem.pub
   = PUBLIC KEY
   = Used by Azure
```

---

## Step 5.2 — Secure the Private Key

```bash
chmod 400 ~/.ssh/my-key.pem
```

Check:

```bash
ls -l ~/.ssh/my-key*
```

### 🚨 NEVER upload this:

```text
my-key.pem
```

to GitHub.

---

# 🏗️ 6. Clone Azure Infrastructure Repository

Clone:

```bash
git clone <AZURE_SM_K8S_IAAC_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/<YOUR_USERNAME>/azure-sm-k8s-iaac.git
```

Enter the folder:

```bash
cd azure-sm-k8s-iaac
```

Check:

```bash
ls -la
```

You may see:

```text
main.tf
variables.tf
outputs.tf
providers.tf
terraform.tfvars
modules/
```

> 📌 Your repository may have a different structure. Always follow the variables and modules actually present in your code.

---

# ⚙️ 7. Configure Terraform

First inspect the variables:

```bash
cat variables.tf
```

Check outputs:

```bash
cat outputs.tf
```

Check your variables file if present:

```bash
cat terraform.tfvars
```

---

## 🔑 Add the SSH PUBLIC key

Read the public key:

```bash
cat ~/.ssh/my-key.pem.pub
```

Copy the complete line.

It will look similar to:

```text
ssh-rsa AAAA...
```

Put this **public key** into the Terraform configuration variable expected by your repository.

### ❌ Wrong

```text
my-key.pem
```

### ✅ Correct

```text
my-key.pem.pub
```

---

# ☁️ 8. Login to Azure

Run:

```bash
az login
```

List subscriptions:

```bash
az account list
```

Select the correct subscription:

```bash
az account set --subscription "<SUBSCRIPTION_ID>"
```

Verify:

```bash
az account show
```

---

# 🚀 9. Create Azure Infrastructure

Now the fun part begins! 🎉

Make sure you are inside:

```text
azure-sm-k8s-iaac
```

---

## 9.1 Initialize Terraform

```bash
terraform init
```

### 🧠 What does it do?

Terraform downloads and initializes the providers/modules needed by the project.

---

## 9.2 Validate

```bash
terraform validate
```

Expected:

```text
Success! The configuration is valid.
```

---

## 9.3 Format

```bash
terraform fmt -recursive
```

---

## 9.4 Create Plan

```bash
terraform plan
```

### 👀 STOP HERE!

Read the plan.

Ask yourself:

```text
✔ Correct subscription?
✔ Correct region?
✔ Correct VM count?
✔ Correct network?
✔ Correct SSH key?
✔ Correct resources?
```

If everything looks correct, continue.

---

## 9.5 Apply

```bash
terraform apply
```

Terraform asks:

```text
Do you want to perform these actions?
```

Enter:

```text
yes
```

☁️ Terraform now creates your Azure infrastructure.

---

# 📤 10. Get Azure IP Addresses

After Terraform completes:

```bash
terraform output
```

You may see something like:

```text
controller_private_ip = "10.x.x.x"
controller_public_ip  = "20.x.x.x"
resource_group_name  = "hireflow-rg"
worker1_private_ip    = "10.x.x.x"
worker1_public_ip     = "20.x.x.x"
```

Your actual output names depend on your Terraform code.

---

## 🎯 Save these values

Create a temporary note:

```text
CONTROLLER_PUBLIC_IP  = __________________

CONTROLLER_PRIVATE_IP = __________________

WORKER1_PUBLIC_IP     = __________________

WORKER1_PRIVATE_IP    = __________________

WORKER2_PUBLIC_IP     = __________________

WORKER2_PRIVATE_IP    = __________________
```

You'll need them later.

---

# 🧠 11. Connect to Controller

From your local machine:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>
```

Example:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@20.x.x.x
```

🎉 If successful, you are now inside the controller VM.

---

# ☸️ 12. Install Kubernetes Controller

Inside the controller:

Clone:

```bash
git clone <SELF_MANAGED_K8S_AUTOMATION_REPOSITORY_URL>
```

Enter:

```bash
cd self-managed-k8s-automation
```

Then:

```bash
cd azure
```

Check:

```bash
ls -l
```

You should find:

```text
controller.sh
worker.sh
```

---

## 🚀 Run Controller Script

```bash
sudo bash controller.sh
```

The script may install/configure:

```text
Container runtime
      ↓
Kubernetes packages
      ↓
System/network settings
      ↓
kubeadm
      ↓
Kubernetes Control Plane
```

---

# 🎟️ 13. Save Kubeadm Join Information

After `controller.sh` completes, it should provide worker join information.

Conceptually it looks like:

```bash
sudo kubeadm join <CONTROLLER_PRIVATE_IP>:6443 \
  --token <TOKEN> \
  --discovery-token-ca-cert-hash sha256:<CA_CERT_HASH>
```

### ✍️ Save these 3 things

```text
1️⃣ Controller Private IP
2️⃣ Kubeadm Token
3️⃣ CA Certificate Hash
```

Example:

```text
CONTROLLER_PRIVATE_IP
10.0.1.10

TOKEN
abcdef.0123456789abcdef

CA_CERT_HASH
sha256:xxxxxxxxxxxxxxxxxxxxxxxx...
```

> 🔐 Treat the bootstrap token as sensitive information.

---

# ⚙️ 14. Connect to Worker

Open a **second terminal** on your local computer.

Run:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<WORKER1_PUBLIC_IP>
```

Example:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@20.x.x.x
```

---

# 🔧 15. Configure Worker Node

On the worker:

```bash
git clone <SELF_MANAGED_K8S_AUTOMATION_REPOSITORY_URL>
```

Then:

```bash
cd self-managed-k8s-automation
cd azure
```

Open:

```bash
vim worker.sh
```

---

## ✏️ Replace these placeholders

Find:

```text
<CONTROLLER_PRIVATE_IP>
<TOKEN>
<CA_CERT_HASH>
```

Replace them with the values from the controller.

Example:

```text
Controller:
10.0.1.10

Token:
abcdef.0123456789abcdef

CA Hash:
sha256:xxxxxxxxxxxxxxxx...
```

---

## 📝 Vim Save Shortcut

To edit:

```text
i
```

Make changes.

Then:

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

# 🚀 16. Join Worker to Kubernetes

Run:

```bash
sudo bash worker.sh
```

Wait for the script to finish.

🎉 The worker should now join the Kubernetes cluster.

---

## 🔁 Multiple Workers?

Repeat the same process:

```text
Worker 1 → worker.sh
Worker 2 → worker.sh
Worker 3 → worker.sh
```

Each worker needs the same:

```text
Controller Private IP
Token
CA Certificate Hash
```

---

# ✅ 17. Verify Kubernetes Cluster

Go back to the controller.

Run:

```bash
kubectl get nodes
```

Expected:

```text
NAME          STATUS   ROLES
controller    Ready    control-plane
worker1       Ready    <none>
worker2       Ready    <none>
```

### 🟢 What you want

```text
STATUS = Ready
```

### 🔴 If you see

```text
NotReady
```

Stop and troubleshoot before deploying HireFlow.

---

## 🔍 More Information

```bash
kubectl get nodes -o wide
```

Cluster information:

```bash
kubectl cluster-info
```

Namespaces:

```bash
kubectl get namespaces
```

---

# 💼 18. Deploy HireFlow

Now Kubernetes is ready.

Clone the GitOps repository:

```bash
git clone <HIREFLOW_GITOPS_LATEST_REPOSITORY_URL>
```

Enter:

```bash
cd hireflow-gitops-latest
```

Check files:

```bash
ls -la
```

You should have the deployment files expected by the project.

---

# ▶️ 19. Run HireFlow Deployment

Give permission:

```bash
chmod +x deploy.sh
```

Run:

```bash
bash deploy.sh
```

If your environment requires root privileges:

```bash
sudo bash deploy.sh
```

The script may create:

```text
Namespace
   ↓
Deployments
   ↓
Pods
   ↓
Services
   ↓
Database resources
   ↓
Other HireFlow resources
```

The exact resources depend on the repository.

---

# 🔄 20. Install Argo CD

Inside:

```text
hireflow-gitops-latest
```

Run:

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

---

## 🔍 Check Argo CD

```bash
kubectl get pods -n argocd
```

You want the Argo CD components to become:

```text
Running
```

Check services:

```bash
kubectl get svc -n argocd
```

---

# 🎯 21. Configure `application.yaml`

Before applying the Argo CD application:

```bash
vim application.yaml
```

Check carefully:

```text
Repository URL
Branch / Revision
Path
Destination Cluster
Namespace
```

---

## ⭐ Most Important

Make sure the repository points to the correct Git repository.

For example:

```text
hireflow-gitops-latest
```

If your actual repository is different, update it.

---

# 🚀 22. Create Argo CD Application

Run:

```bash
kubectl apply -f application.yaml
```

Expected:

```text
application.argoproj.io/<APP_NAME> created
```

Check:

```bash
kubectl get applications -A
```

---

# 🔐 23. Get Argo CD Password

For a standard Argo CD installation:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

Save the password securely.

Standard username is commonly:

```text
admin
```

> ⚠️ If your `install-argocd.sh` uses a different authentication method, use the credentials provided by that script.

---

# 🌐 24. Open Argo CD

Your installation script should provide the URL/IP.

Open it in Chrome.

If you receive a certificate warning for a development/self-signed endpoint:

```text
Advanced
   ↓
Continue
```

Only proceed if you recognize and trust the endpoint.

Then login:

```text
Username: admin
Password: <YOUR_PASSWORD>
```

---

# 🟢 25. What Does "Synced + Healthy" Mean?

In Argo CD:

```text
Git Repository
      ↓
Desired State
      ↓
Argo CD
      ↓
Kubernetes
      ↓
Actual State
```

### 🟢 Synced

Kubernetes matches the configuration stored in Git.

### 🟢 Healthy

The deployed Kubernetes resources are operating normally according to their health checks.

### 🔴 OutOfSync

The cluster does not currently match the Git configuration.

---

# 💚 26. Verify HireFlow

Check namespace:

```bash
kubectl get namespaces
```

Then:

```bash
kubectl get pods -n hireflow
```

More details:

```bash
kubectl get pods -n hireflow -o wide
```

---

## 🚀 Check Deployments

```bash
kubectl get deployment -n hireflow
```

Check rollout:

```bash
kubectl rollout status deployment/<DEPLOYMENT_NAME> -n hireflow
```

---

## 🌐 Check Services

```bash
kubectl get svc -n hireflow
```

Detailed:

```bash
kubectl get svc -n hireflow -o wide
```

---

## 🌍 Check Ingress

```bash
kubectl get ingress -n hireflow
```

Detailed:

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

---

# 🔎 27. Troubleshooting — Your DevOps Toolbox

When something breaks, don't panic. 😎

Use this flow:

```text
❓ Problem
   ↓
kubectl get
   ↓
kubectl describe
   ↓
kubectl logs
   ↓
kubectl get events
   ↓
Fix
   ↓
Verify again
```

---

# 🧩 28. Cluster & Node Commands

### Cluster information

```bash
kubectl cluster-info
```

### All nodes

```bash
kubectl get nodes
```

### Nodes with IPs

```bash
kubectl get nodes -o wide
```

### Detailed node information

```bash
kubectl describe node <NODE_NAME>
```

### Namespaces

```bash
kubectl get namespaces
```

---

# 📦 29. Pod Commands

### HireFlow pods

```bash
kubectl get pods -n hireflow
```

### Pods + IP + Node

```bash
kubectl get pods -n hireflow -o wide
```

### All namespaces

```bash
kubectl get pods -A
```

### Describe pod

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

### Delete pod

```bash
kubectl delete pod <POD_NAME> -n hireflow
```

> 💡 If the pod belongs to a Deployment, Kubernetes normally creates a replacement.

---

# ⭐ 30. Logs — Most Important for Troubleshooting

## Normal logs

```bash
kubectl logs <POD_NAME> -n hireflow
```

## Live logs

```bash
kubectl logs -f <POD_NAME> -n hireflow
```

## Specific container

```bash
kubectl logs <POD_NAME> -c <CONTAINER_NAME> -n hireflow
```

## Previous container

```bash
kubectl logs <POD_NAME> --previous -n hireflow
```

### 💡 Remember

If an application crashes:

```text
kubectl logs
      ↓
Find the real application error
```

---

# 🌐 31. Service Commands

```bash
kubectl get svc -n hireflow
```

```bash
kubectl get svc -n hireflow -o wide
```

```bash
kubectl describe svc <SERVICE_NAME> -n hireflow
```

Check endpoints:

```bash
kubectl get endpoints -n hireflow
```

---

# 🌍 32. Ingress Commands

```bash
kubectl get ingress -n hireflow
```

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

Check:

```text
Hostname
Backend
Service
Port
Address
Events
```

---

# 🗂️ 33. ConfigMaps & Secrets

### ConfigMaps

```bash
kubectl get configmap -n hireflow
```

```bash
kubectl describe configmap <CONFIGMAP_NAME> -n hireflow
```

### Secrets

```bash
kubectl get secrets -n hireflow
```

```bash
kubectl describe secret <SECRET_NAME> -n hireflow
```

> 🔐 Never expose secret values in screenshots, GitHub, logs, or public documentation.

---

# 🕵️ 34. Events — Your Kubernetes CCTV

Events often tell you **why** something failed.

Run:

```bash
kubectl get events -n hireflow
```

Better:

```bash
kubectl get events -n hireflow --sort-by='.lastTimestamp'
```

All namespaces:

```bash
kubectl get events -A --sort-by='.lastTimestamp'
```

---

# 📄 35. Get Full YAML

### Pod

```bash
kubectl get pod <POD_NAME> -n hireflow -o yaml
```

### Deployment

```bash
kubectl get deployment <DEPLOYMENT_NAME> -n hireflow -o yaml
```

### Service

```bash
kubectl get svc <SERVICE_NAME> -n hireflow -o yaml
```

Useful for checking:

```text
Image
Labels
Selectors
Ports
Environment variables
Volumes
Probes
Resources
```

---

# 🧯 36. Common Problems

## ❌ SSH — Permission Denied

Check:

```bash
chmod 400 ~/.ssh/my-key.pem
```

Then:

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<PUBLIC_IP>
```

Also verify:

```text
Correct IP
Correct username
Correct private key
Correct Azure SSH configuration
```

---

## ❌ Terraform Creates Unexpected Resources

STOP before applying.

Run:

```bash
terraform plan
```

Check:

```text
terraform.tfvars
main.tf
variables.tf
modules/
Azure subscription
```

---

## ❌ Worker Does Not Join

On worker:

```bash
sudo systemctl status kubelet
```

Check controller connectivity:

```bash
ping <CONTROLLER_PRIVATE_IP>
```

Check kubelet logs:

```bash
sudo journalctl -u kubelet -xe
```

Verify:

```text
Controller private IP
Token
CA certificate hash
```

---

## ❌ Node = NotReady

Run:

```bash
kubectl describe node <NODE_NAME>
```

Then:

```bash
sudo systemctl status kubelet
```

And:

```bash
sudo journalctl -u kubelet -xe
```

---

## ❌ Pod = Pending

Run:

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

Look at:

```text
Events
```

Possible causes:

```text
CPU/memory shortage
Node selector
Taints/tolerations
PVC
Volumes
Scheduling
```

---

## ❌ Pod = CrashLoopBackOff

Start here:

```bash
kubectl logs <POD_NAME> -n hireflow
```

Then:

```bash
kubectl logs <POD_NAME> --previous -n hireflow
```

Then:

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

Common causes:

```text
Application error
Database connection
Missing environment variable
Wrong port
Wrong credentials
Health probe failure
```

---

## ❌ ImagePullBackOff

Run:

```bash
kubectl describe pod <POD_NAME> -n hireflow
```

Check:

```text
Image name
Image tag
Registry
ImagePullSecret
Registry authentication
```

---

## ❌ Service Not Working

Run:

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

Check pod labels:

```bash
kubectl get pods -n hireflow --show-labels
```

### 🧠 Key concept

Service selector must match the correct pod labels.

```text
Service Selector
       ↓
   Pod Labels
       ↓
   Endpoint
       ↓
   Application
```

---

## ❌ Ingress Not Working

Run:

```bash
kubectl get ingress -n hireflow
```

Then:

```bash
kubectl describe ingress <INGRESS_NAME> -n hireflow
```

Check:

```text
Ingress controller
DNS
Hostname
Backend
Service
Port
External address
Events
```

---

## ❌ Argo CD = OutOfSync

Check:

```text
Repository URL
Branch
Path
Destination
Namespace
```

Then verify the Kubernetes resources:

```bash
kubectl get pods -n hireflow
kubectl get svc -n hireflow
kubectl get deployment -n hireflow
```

---

# 🧑‍💻 37. Useful Deployment Commands

### Rollout status

```bash
kubectl rollout status deployment/<DEPLOYMENT_NAME> -n hireflow
```

### Restart deployment

```bash
kubectl rollout restart deployment/<DEPLOYMENT_NAME> -n hireflow
```

### Check deployment

```bash
kubectl get deployment -n hireflow
```

### Enter container

```bash
kubectl exec -it <POD_NAME> -n hireflow -- /bin/sh
```

If Bash exists:

```bash
kubectl exec -it <POD_NAME> -n hireflow -- /bin/bash
```

---

# 🏆 38. Top 15 Commands to Memorize

If you're preparing for a DevOps interview, start with these:

### 1️⃣ Nodes

```bash
kubectl get nodes
```

### 2️⃣ All pods

```bash
kubectl get pods -A
```

### 3️⃣ HireFlow pods

```bash
kubectl get pods -o wide -n hireflow
```

### 4️⃣ Describe pod

```bash
kubectl describe pod <POD> -n hireflow
```

### 5️⃣ Logs

```bash
kubectl logs <POD> -n hireflow
```

### 6️⃣ Live logs

```bash
kubectl logs -f <POD> -n hireflow
```

### 7️⃣ Services

```bash
kubectl get svc -n hireflow
```

### 8️⃣ Describe service

```bash
kubectl describe svc <SVC> -n hireflow
```

### 9️⃣ Ingress

```bash
kubectl get ingress -n hireflow
```

### 🔟 Describe ingress

```bash
kubectl describe ingress <INGRESS> -n hireflow
```

### 1️⃣1️⃣ Events

```bash
kubectl get events -n hireflow
```

### 1️⃣2️⃣ Deployments

```bash
kubectl get deployment -n hireflow
```

### 1️⃣3️⃣ Rollout

```bash
kubectl rollout status deployment/<DEPLOYMENT> -n hireflow
```

### 1️⃣4️⃣ Restart

```bash
kubectl rollout restart deployment/<DEPLOYMENT> -n hireflow
```

### 1️⃣5️⃣ Enter pod

```bash
kubectl exec -it <POD> -n hireflow -- /bin/sh
```

---

# 🧠 39. Simple Troubleshooting Cheat Sheet

```text
Pod not starting?
       ↓
kubectl get pods
       ↓
kubectl describe pod
       ↓
kubectl logs
       ↓
kubectl get events
```

```text
Application not reachable?
       ↓
kubectl get svc
       ↓
kubectl describe svc
       ↓
kubectl get endpoints
       ↓
kubectl get ingress
```

```text
Node problem?
       ↓
kubectl get nodes
       ↓
kubectl describe node
       ↓
systemctl status kubelet
       ↓
journalctl -u kubelet
```

```text
Argo CD problem?
       ↓
Check application status
       ↓
Repository
       ↓
Revision
       ↓
Path
       ↓
Destination
       ↓
Kubernetes resources
```

---

# 📋 40. Full Deployment Checklist

## 🔐 GitHub

- [ ] Repository access confirmed
- [ ] Fine-grained token created if required
- [ ] Correct repository selected
- [ ] Required permissions configured
- [ ] GitHub Actions secret created if required
- [ ] Token kept private

## 🔑 SSH

- [ ] PEM key created
- [ ] Public key configured
- [ ] Private key permission = `400`
- [ ] Private key not committed

## ☁️ Azure

- [ ] `az login`
- [ ] Correct subscription selected
- [ ] Terraform repository cloned
- [ ] Variables configured
- [ ] `terraform init`
- [ ] `terraform validate`
- [ ] `terraform plan`
- [ ] `terraform apply`
- [ ] Controller IP received
- [ ] Worker IP received

## ☸️ Controller

- [ ] SSH successful
- [ ] Automation repository cloned
- [ ] `controller.sh` executed
- [ ] Kubernetes initialized
- [ ] Token saved
- [ ] CA hash saved
- [ ] Controller private IP saved

## ⚙️ Workers

- [ ] Worker SSH successful
- [ ] Automation repository cloned
- [ ] `worker.sh` updated
- [ ] Controller IP updated
- [ ] Token updated
- [ ] CA hash updated
- [ ] `worker.sh` executed
- [ ] Worker = Ready

## 💼 HireFlow

- [ ] GitOps repository cloned
- [ ] `deploy.sh` executable
- [ ] `deploy.sh` executed
- [ ] `hireflow` namespace exists
- [ ] Pods checked
- [ ] Services checked
- [ ] Database checked if applicable

## 🔄 Argo CD

- [ ] `install-argocd.sh` executable
- [ ] Argo CD installed
- [ ] Argo CD pods checked
- [ ] `application.yaml` reviewed
- [ ] Correct repository configured
- [ ] Application applied
- [ ] Argo CD URL obtained
- [ ] Login successful
- [ ] Application = Synced
- [ ] Application = Healthy

## 🌐 Final

- [ ] Pods Running
- [ ] Pods Ready
- [ ] Services correct
- [ ] Endpoints available
- [ ] Ingress configured
- [ ] Logs healthy
- [ ] No critical events
- [ ] Database connection healthy
- [ ] HireFlow accessible

---

# 🔒 41. Security Rules — VERY IMPORTANT

## ❌ Never commit

```text
*.pem
*.key
.env
Passwords
GitHub tokens
Azure credentials
Database passwords
API keys
Kubeadm tokens
Private certificates
```

Example `.gitignore`:

```gitignore
*.pem
*.key
.env
.terraform/
terraform.tfstate
terraform.tfstate.*
```

> ⚠️ Terraform state can contain sensitive information. Protect it carefully.

---

# 🚨 If a Secret Is Accidentally Exposed

Immediately:

```text
1. Revoke the token/credential
2. Create a new credential
3. Update GitHub/Azure/Kubernetes secret
4. Check Git history
5. Remove exposed secret from future commits
6. Rotate related credentials if necessary
```

---

# ⚡ 42. One-Page Quick Start

For experienced users, this is the short flow.

## 🔑 SSH

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/my-key.pem
chmod 400 ~/.ssh/my-key.pem
```

## ☁️ Azure + Terraform

```bash
az login
az account set --subscription "<SUBSCRIPTION_ID>"

git clone <AZURE_SM_K8S_IAAC_REPOSITORY_URL>
cd azure-sm-k8s-iaac

terraform init
terraform validate
terraform plan
terraform apply

terraform output
```

## 🧠 Controller

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<CONTROLLER_PUBLIC_IP>

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

## ⚙️ Worker

```bash
ssh -i ~/.ssh/my-key.pem azureuser@<WORKER_PUBLIC_IP>

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

## ☸️ Verify

```bash
kubectl get nodes
kubectl get nodes -o wide
kubectl cluster-info
```

## 💼 HireFlow

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

## 🔄 Argo CD

```bash
chmod +x install-argocd.sh
bash install-argocd.sh
```

Edit:

```bash
vim application.yaml
```

Apply:

```bash
kubectl apply -f application.yaml
```

## 🔍 Verify

```bash
kubectl get pods -n hireflow
kubectl get svc -n hireflow
kubectl get ingress -n hireflow
kubectl get deployment -n hireflow
kubectl get events -n hireflow --sort-by='.lastTimestamp'
```

---

# 🏁 43. Final End-to-End Flow

```text
                    🚀 HIREFLOW DEPLOYMENT

                         START
                           │
                           ▼
                    🔐 GitHub Access
                           │
                           ▼
                     🔑 SSH PEM Key
                           │
                           ▼
              📦 azure-sm-k8s-iaac
                           │
                           ▼
                   ☁️ Terraform
                           │
                 terraform apply
                           │
                           ▼
                🖥️ Azure VMs Created
                           │
                           ▼
                 🧠 Controller VM
                           │
                  controller.sh
                           │
                           ▼
              🎟️ Token + CA Hash
                           │
                           ▼
                  ⚙️ Worker VM(s)
                           │
                     worker.sh
                           │
                           ▼
                ☸️ Kubernetes Ready
                           │
                           ▼
             📦 hireflow-gitops-latest
                           │
                      deploy.sh
                           │
                           ▼
                    💼 HireFlow
                           │
                           ▼
                    🔄 Argo CD
                           │
                  application.yaml
                           │
                           ▼
                 🟢 Synced + Healthy
                           │
                           ▼
                     🌐 LIVE APP
                           │
                           ▼
                         🎉 DONE
```

---

# ⭐ Golden Rules

> **1. Read `terraform plan` before `terraform apply`.**

> **2. Never use or share the SSH private key publicly.**

> **3. Never commit tokens/passwords/secrets.**

> **4. Always verify `kubectl get nodes` before deploying the application.**

> **5. When a pod fails, start with `kubectl describe` + `kubectl logs`.**

> **6. When something is unclear, check Kubernetes Events.**

> **7. Git is the source of truth in a GitOps workflow.**

> **8. Make one change at a time and verify it.**

---

# 🎯 You're Ready!

If you can follow this complete flow, you understand the core deployment lifecycle:

```text
Infrastructure as Code
        +
Cloud
        +
Linux
        +
Docker/Container Runtime
        +
Kubernetes
        +
CI/CD / GitOps
        +
Argo CD
        =
🚀 DevOps Deployment
```

**Welcome to HireFlow DevOps! ☁️☸️🚀**
