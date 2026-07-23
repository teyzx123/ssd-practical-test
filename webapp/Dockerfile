FROM node:20-alpine
WORKDIR /app

# Install production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy only the files the application needs.
# Avoids "COPY . ." which can inadvertently include sensitive files.
COPY server.js validate.js ./
COPY views ./views
COPY public ./public

# Drop root privileges - the node image provides a non-root "node" user
USER node

EXPOSE 3000
CMD ["node", "server.js"]
