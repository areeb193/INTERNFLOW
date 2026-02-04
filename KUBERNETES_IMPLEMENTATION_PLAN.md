# ☸️ Kubernetes Implementation Master Plan (Production-Ready)

This document outlines the architectural decisions, best practices, and implementation strategy for deploying the MERN Stack Job Portal on Kubernetes (Minikube). 

**Context for AI/Copilot:** When generating code for this project, strictly follow these constraints and patterns.

---

## 1. Docker Strategy & Image Optimization 🐳

We must prioritize small image sizes and security. Do not use default heavy images.

### **Frontend (React)**
- **Pattern:** Multi-Stage Build.
- **Stage 1 (Builder):** Use `node:18-alpine`. Run `npm run build` to generate the static `dist` folder.
- **Stage 2 (Runner):** Use `nginx:alpine`.
- **Configuration:** - Copy custom `nginx.conf` to handle React Router (SPA).
  - Essential Nginx Rule: `try_files $uri $uri/ /index.html;` (prevents 404 on refresh).
- **Goal:** Final image should contain only Nginx and static assets (no Node.js runtime).

### **Backend (Node.js)**
- **Base Image:** Use `node:18-alpine`.
- **Optimization:** - Use `.dockerignore` to exclude `node_modules`, `.env`, `.git`, and logs.
  - Install dependencies using `npm ci --only=production` (if lockfile exists) or standard install.
- **User:** (Optional but recommended) Run as non-root user `node` for security.

---

## 2. Security Management (Secrets) 🔐

**NEVER** hardcode sensitive data in `deployment.yaml`.
**NEVER** commit `.env` files to the repository.

### **Mechanism**
- Use **Kubernetes Secrets** (Type: `Opaque`).
- All values must be **Base64 encoded** in the YAML file.

### **Required Secrets Keys**
Map these from the project's environment variables:
1.  **Database:** `MONGO_URI`
2.  **Authentication:** `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
3.  **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4.  **External APIs:** `RAPIDAPI_KEY`

---

## 3. Database Persistence (MongoDB) 💾

MongoDB containers are ephemeral. Restarting a pod must NOT lose data.

### **Strategy**
- **Resource:** `PersistentVolumeClaim` (PVC).
- **Access Mode:** `ReadWriteOnce`.
- **Storage Request:** `1Gi` (sufficient for development/demo).
- **Mount Path:** Container must mount the PVC to `/data/db`.

---

## 4. Self-Healing & Observability (Probes) 🩺

Ensure zero-downtime and automatic recovery from crashes.

### **Liveness Probe (Am I alive?)**
- **Action:** HTTP GET request.
- **Path:** `/api/v1/health` (Create this endpoint in backend if missing).
- **Behavior:** If this fails 3 times, Kubernetes **restarts** the pod.

### **Readiness Probe (Am I ready for traffic?)**
- **Action:** HTTP GET request (or TCP Socket check).
- **Logic:** Check if MongoDB connection is established.
- **Behavior:** If this fails, Kubernetes **stops sending traffic** to the pod (does not restart it).

---

## 5. Real-Time Chat Scaling (Socket.IO) 💬

Socket.IO requires persistent connections between the client and the specific pod handling their session.

### **Network Strategy**
- **Service Type:** `LoadBalancer` (for Minikube access) or `NodePort`.
- **Crucial Setting:** Enable **Sticky Sessions**.
- **YAML Configuration:** ```yaml
  spec:
    sessionAffinity: ClientIP
    sessionAffinityConfig:
      clientIP:
        timeoutSeconds: 10800