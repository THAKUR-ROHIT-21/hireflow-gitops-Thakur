# HireFlow Project Deployment Guide

This repository provides a step-by-step guide to provisioning Azure infrastructure using Terraform, configuring a self-managed Kubernetes (k8s) cluster using `kubeadm`, and deploying applications via GitOps using ArgoCD.

---

## 📋 Table of Contents

1. [Prerequisites & Repository Setup](#1-prerequisites--repository-setup)
2. [GitHub Personal Access Token (PAT) Configuration](#2-github-personal-access-token-pat-configuration)
3. [GitHub Actions Secrets Setup](#3-github-actions-secrets-setup)
4. [SSH Key Pair Generation](#4-ssh-key-pair-generation)
5. [Infrastructure Provisioning via Terraform (Azure)](#5-infrastructure-provisioning-via-terraform-azure)
6. [Kubernetes Cluster Initialization](#6-kubernetes-cluster-initialization)
   - [Setup Controller Node](#61-setup-controller-node)
   - [Setup Worker Node](#62-setup-worker-node)
   - [Verify Cluster Status](#63-verify-cluster-status)
7. [HireFlow Application Deployment](#7-hireflow-application-deployment)
8. [ArgoCD GitOps Integration](#8-argocd-gitops-integration)
9. [Kubernetes Operations & Troubleshooting Commands](#9-kubernetes-operations--troubleshooting-commands)

---

## 1. Prerequisites & Repository Setup

Ensure you have the following tools installed locally:
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [Git](https://git-scm.com/)
- [SSH Client](https://www.openssh.com/)

### Clone Required Repositories

Clone the following repositories into your workspace (or fork/clone and push them to your personal GitHub account):

```bash
# 1. Azure Infrastructure as Code (Terraform)
git clone <your-repo-url>/azure-sm-k8s-iaac.git

# 2. Self-Managed Kubernetes Cluster Automation Scripts
git clone <your-repo-url>/self-managed-k8s-automation.git

# 3. HireFlow GitOps Manifests & Scripts (Latest)
git clone <your-repo-url>/hireflow-gitops-latest.git

# 4. HireFlow GitOps (Thakur - optional/if required)
git clone <your-repo-url>/hireflow-gitops-Thakur.git