# HireFlow Project — Complete End-to-End Setup & Deployment Guide

Is document me HireFlow project ke Infrastructure Provisioning (Azure Terraform), Self-managed Kubernetes Cluster Setup, GitOps deployment (ArgoCD), aur essential Kubernetes debugging commands ki poori step-by-step jankari di gayi hai.

---

## 📋 Prerequisite Repositories

Sabse pehle niche diye gaye repositories ko apne GitHub account par clone/push karein:

1. `azure-sm-k8s-iaac` — Azure infrastructure (Terraform) provisioning ke liye.
2. `self-managed-k8s-automation` — Kubernetes Controller aur Worker node automation scripts ke liye.
3. `hireflow-gitops-latest` — GitOps deployment aur application manifests ke liye.
4. `hireflow-gitops-Thakur` (Optional) — Backup ya secondary GitOps repository.

---

## 🔑 Step 1: GitHub Configuration & PAT Token Generation

### 1. Fine-grained Personal Access Token (PAT) create karein
1. GitHub par sign in karein -> **Profile Picture** -> **Settings**.
2. Left sidebar me niche scroll karke **Developer settings** par click karein.
3. **Personal access tokens** -> **Fine-grained tokens** me jayein.
4. **Generate new token** par click karein (Password/OTP verification complete karein).
5. Details fill karein:
   - **Token name:** Meaningful name dein (e.g., `HireFlow-DevOps-Token`).
   - **Expiration:** Expiration days set karein.
   - **Description:** Token ki details likhein.
   - **Repository access:** **Only select repositories** choose karein aur apne **DevOps / GitOps repo** ko select karein.
6. **Permissions set karein:**
   - **Administration:** `Read-only`
   - **Contents:** `Read and write`
7. Page ke end me **Generate token** par click karein aur token ko safely copy karke rakh lein.

### 2. Secrets & Variables configure karein
1. Developer / Target Repository me jayein -> **Settings**.
2. **Secrets and variables** -> **Actions** choose karein.
3. **New repository secret** par click karein.
4. **Secret Name** aur **Secret Value** (Token ya required secret credentials) enter karke **Add secret** click karein.

---

## 🔑 Step 2: SSH Key Generation (Azure VM Access ke liye)

Local machine par SSH key pair generate karein jisko Azure VM creation aur SSH login me use kiya jayega:

```bash
# 1. RSA 4096-bit PEM key pair generate karein
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/my-key

# 2. Key permission set karein (Only read for owner)
chmod 400 ~/.ssh/my-key.pem

# 3. Key verify karein
ls -l ~/.ssh/my-key*