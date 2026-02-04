# ========================================
# Stage 1: Build React Application
# ========================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Build production bundle
# This creates the 'dist' folder
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/nginx.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for Nginx
# Ensure proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    mkdir -p /tmp/nginx /var/cache/nginx && \
    chown -R nginx:nginx /tmp/nginx && \
    chown -R nginx:nginx /var/cache/nginx

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
