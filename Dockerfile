# Use Azure Functions base image with Node.js
FROM mcr.microsoft.com/azure-functions/node:4-node20-slim

# Set working directory
WORKDIR /home/site/wwwroot

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled files and configuration
COPY dist/ ./dist/
COPY host.json ./

# Expose Azure Functions port
EXPOSE 80

# Azure Functions environment variables
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true
