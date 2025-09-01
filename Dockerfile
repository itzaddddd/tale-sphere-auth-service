# ----- STage build -----
# Useer Node.js LTS as base
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ----- Stage run -----
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only  necessary files form builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Export app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]