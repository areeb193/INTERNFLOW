# 🚀 Kubernetes Deployment Guide

This guide walks you through deploying the Job Portal MERN application to Minikube.

## Prerequisites

- ✅ Minikube installed and running
- ✅ kubectl configured
- ✅ Docker installed

## Quick Start (Automated)

### Windows PowerShell
```powershell
# Navigate to project directory
cd "C:\Users\DELLL\Desktop\job portal"

# Run automated deployment script
bash deploy.sh
```

If bash is not available on Windows, follow the manual steps below.

---

## Manual Deployment Steps

### Step 1: Start Minikube
```powershell
minikube start
```

Verify:
```powershell
minikube status
```

---

### Step 2: Configure Docker to Use Minikube

**PowerShell (Windows):**
```powershell
minikube docker-env | Invoke-Expression
```

**Bash/Linux/Mac:**
```bash
eval $(minikube docker-env)
```

---

### Step 3: Build Docker Images

```powershell
# Build backend
docker build -t job-portal-backend:v1 ./backend

# Build frontend
docker build -t job-portal-frontend:v1 ./frontend
```

**Verify images:**
```powershell
docker images | Select-String "job-portal"
```

Expected output:
```
job-portal-backend   v1   abc123   5 minutes ago   185MB
job-portal-frontend  v1   def456   3 minutes ago   25MB
```

---

### Step 4: Deploy to Kubernetes

```powershell
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets
kubectl apply -f k8s/secrets.yaml

# Deploy MongoDB with persistent storage
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

# Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

---

### Step 5: Verify Deployment

**Check all resources:**
```powershell
kubectl get all -n job-portal
```

**Check PVC status:**
```powershell
kubectl get pvc -n job-portal
```

**Check pods:**
```powershell
kubectl get pods -n job-portal
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
mongodb-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
```

---

### Step 6: Access the Application

**Get service URLs:**
```powershell
# Frontend
minikube service frontend-service -n job-portal --url

# Backend
minikube service backend-service -n job-portal --url
```

**Open in browser:**
```powershell
# Open frontend
minikube service frontend-service -n job-portal

# Open backend health check
minikube service backend-service -n job-portal
```

---

## Troubleshooting

### Issue 1: Pods Not Starting

**Check pod status:**
```powershell
kubectl get pods -n job-portal
```

**View pod logs:**
```powershell
# Backend logs
kubectl logs -f deployment/backend -n job-portal

# Frontend logs
kubectl logs -f deployment/frontend -n job-portal

# MongoDB logs
kubectl logs -f deployment/mongodb -n job-portal
```

**Describe pod for events:**
```powershell
kubectl describe pod <pod-name> -n job-portal
```

---

### Issue 2: Image Pull Errors

**Error:** `ErrImageNeverPull` or `ImagePullBackOff`

**Solution:** Ensure Docker is using Minikube's daemon:
```powershell
# PowerShell
minikube docker-env | Invoke-Expression

# Rebuild images
docker build -t job-portal-backend:v1 ./backend
docker build -t job-portal-frontend:v1 ./frontend

# Verify images exist in Minikube
docker images | Select-String "job-portal"
```

---

### Issue 3: MongoDB Connection Failed

**Check MongoDB pod:**
```powershell
kubectl get pods -n job-portal | Select-String "mongodb"
```

**Check MongoDB logs:**
```powershell
kubectl logs deployment/mongodb -n job-portal
```

**Verify service:**
```powershell
kubectl get svc mongodb-service -n job-portal
```

**Test connection from backend:**
```powershell
kubectl exec -it deployment/backend -n job-portal -- sh
# Inside container:
# ping mongodb-service
```

---

### Issue 4: PVC Not Bound

**Check PVC status:**
```powershell
kubectl get pvc -n job-portal
```

If status is `Pending`:
```powershell
kubectl describe pvc mongodb-pvc -n job-portal
```

**Fix:** Ensure Minikube has default storage class:
```powershell
kubectl get storageclass
```

---

### Issue 5: Services Not Accessible

**Check service type:**
```powershell
kubectl get svc -n job-portal
```

**Get external IP:**
```powershell
minikube service list -n job-portal
```

**Enable Minikube tunnel (if LoadBalancer pending):**
```powershell
# In separate terminal
minikube tunnel
```

---

## Monitoring & Logs

### View Real-time Logs
```powershell
# Backend logs
kubectl logs -f deployment/backend -n job-portal

# Frontend logs
kubectl logs -f deployment/frontend -n job-portal

# All pods logs
kubectl logs -f -l tier=application -n job-portal
```

### Check Resource Usage
```powershell
kubectl top pods -n job-portal
kubectl top nodes
```

### View Events
```powershell
kubectl get events -n job-portal --sort-by='.lastTimestamp'
```

---

## Scaling

### Scale Backend
```powershell
kubectl scale deployment backend --replicas=3 -n job-portal
```

### Scale Frontend
```powershell
kubectl scale deployment frontend --replicas=3 -n job-portal
```

### Verify scaling
```powershell
kubectl get pods -n job-portal
```

---

## Cleanup

### Delete all resources
```powershell
kubectl delete namespace job-portal
```

### Stop Minikube
```powershell
minikube stop
```

### Delete Minikube cluster
```powershell
minikube delete
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Minikube Cluster                │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Namespace: job-portal           │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Frontend (2 replicas)      │ │ │
│  │  │  - Nginx Alpine             │ │ │
│  │  │  - Port: 80                 │ │ │
│  │  │  - LoadBalancer Service     │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Backend (2 replicas)       │ │ │
│  │  │  - Node.js Alpine           │ │ │
│  │  │  - Port: 8000               │ │ │
│  │  │  - Socket.IO (sticky)       │ │ │
│  │  │  - LoadBalancer Service     │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  MongoDB (1 replica)        │ │ │
│  │  │  - Mongo 7.0 Alpine         │ │ │
│  │  │  - Port: 27017              │ │ │
│  │  │  - PVC: 1Gi storage         │ │ │
│  │  │  - ClusterIP Service        │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Secrets                    │ │ │
│  │  │  - MongoDB URI              │ │ │
│  │  │  - JWT Secret               │ │ │
│  │  │  - Cloudinary Credentials   │ │ │
│  │  │  - Google OAuth             │ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Production Considerations

### Before deploying to production:

1. **Use external MongoDB** (MongoDB Atlas)
2. **Update secrets** with production credentials
3. **Configure Ingress** instead of LoadBalancer
4. **Enable TLS/HTTPS**
5. **Set up monitoring** (Prometheus + Grafana)
6. **Configure autoscaling** (HPA)
7. **Implement backup strategy** for MongoDB
8. **Use managed Kubernetes** (AKS, EKS, GKE)
9. **Set resource limits** based on load testing
10. **Configure logging** (ELK/EFK stack)

---

## Support

For issues or questions:
1. Check logs: `kubectl logs -f deployment/<name> -n job-portal`
2. Describe resources: `kubectl describe <resource> -n job-portal`
3. Review [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
4. Check [KUBERNETES_IMPLEMENTATION_PLAN.md](KUBERNETES_IMPLEMENTATION_PLAN.md)
