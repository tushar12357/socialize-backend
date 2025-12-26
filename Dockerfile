# -------- Base Image --------
FROM node:20-alpine

# -------- App Directory --------
WORKDIR /app

# -------- Dependencies --------
COPY package*.json ./
RUN npm ci --only=production

# -------- App Source --------
COPY src ./src

# -------- Environment --------
ENV NODE_ENV=production
ENV PORT=3000

# -------- Expose Port --------
EXPOSE 3000

# -------- Start Server --------
CMD ["node", "src/server.js"]
