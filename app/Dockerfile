# Build stage for frontend
FROM node:20 as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Build stage for backend
FROM node:20 as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend ./

# Production stage
FROM node:20
WORKDIR /app
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Create a shared volume for uploads and set permissions
VOLUME /app/uploads
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads && chmod 755 /app/uploads

# Switch to non-root user
USER node

# Create uploads directory and set permissions
WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "server.js"]