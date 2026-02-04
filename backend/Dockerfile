# Stage 1: Production-ready Node.js backend
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install ONLY production dependencies
# Use npm install since package-lock.json is out of sync
    RUN npm install --only=production && \
    npm cache clean --force

# Copy application source code
COPY . .

# Create non-root user for security (Alpine syntax)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Expose backend port
EXPOSE 8000

# Health check for Kubernetes probes
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "index.js"]
