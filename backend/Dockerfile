#Build Stage
FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#Runtime Stage
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl bash

RUN curl -o /app/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /app/wait-for-it.sh

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/src/main"]
