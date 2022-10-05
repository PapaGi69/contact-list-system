# Builder image
FROM registry.ubx.ph/docker-images/node:14.18-alpine3.14 AS builder
#FROM node:18.4.0-alpine3.16 AS builder

# Copy source code
WORKDIR /package
COPY . /package

# Install dependencies
RUN npm -g install @nestjs/cli
RUN npm install webpack
RUN npm install
RUN npm run build

# Final image
FROM registry.ubx.ph/docker-images/node:14.18-alpine3.14 AS final
#FROM node:18.4.0-alpine3.16 AS final

WORKDIR /app
COPY package*.json ./

# Install only dependencies
RUN npm install --only=production

# Install dependencies for db migration
RUN npm install ts-node env-cmd

COPY --from=builder /package/dist ./dist
COPY --from=builder /package/start.sh ./start.sh
COPY --from=builder /package/.env ./.env

CMD ["node","dist/main"]
