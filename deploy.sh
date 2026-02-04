#!/bin/bash
# Kubernetes Deployment Script for Job Portal

set -e  # Exit on error

echo "=========================================="
echo "Job Portal - Kubernetes Deployment Script"
echo "=========================================="

# Step 1: Ensure Minikube is running
echo ""
echo "Step 1: Checking Minikube status..."
if ! minikube status &> /dev/null; then
    echo "❌ Minikube is not running. Starting Minikube..."
    minikube start
else
    echo "✅ Minikube is running"
fi

# Step 2: Point Docker to Minikube's Docker daemon
echo ""
echo "Step 2: Configuring Docker to use Minikube..."
eval $(minikube docker-env)
echo "✅ Docker configured to use Minikube's daemon"

# Step 3: Build Docker images
echo ""
echo "Step 3: Building Docker images..."
echo "Building backend image..."
docker build -t job-portal-backend:v1 ./backend
echo "✅ Backend image built"

echo "Building frontend image..."
docker build -t job-portal-frontend:v1 ./frontend
echo "✅ Frontend image built"

# Verify images
echo ""
echo "Verifying images..."
docker images | grep job-portal

# Step 4: Apply Kubernetes manifests
echo ""
echo "Step 4: Deploying to Kubernetes..."

echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "Creating secrets..."
kubectl apply -f k8s/secrets.yaml

echo "Creating MongoDB PVC..."
kubectl apply -f k8s/mongodb-pvc.yaml

echo "Deploying MongoDB..."
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

echo "Deploying Backend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

echo "Deploying Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Step 5: Wait for deployments
echo ""
echo "Step 5: Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n job-portal
kubectl wait --for=condition=available --timeout=300s deployment/backend -n job-portal
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n job-portal

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="

# Display service URLs
echo ""
echo "Getting service URLs..."
echo ""
echo "Frontend URL:"
minikube service frontend-service -n job-portal --url
echo ""
echo "Backend URL:"
minikube service backend-service -n job-portal --url

echo ""
echo "To view all resources:"
echo "  kubectl get all -n job-portal"
echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/backend -n job-portal"
echo "  kubectl logs -f deployment/frontend -n job-portal"
echo ""
echo "To access services:"
echo "  minikube service frontend-service -n job-portal"
echo "  minikube service backend-service -n job-portal"
