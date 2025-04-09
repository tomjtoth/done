FROM node:23-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules .
COPY --from=builder /app/.next .
COPY --from=builder /app/public .
COPY --from=builder /app/migrations .

ENV \
    NODE_ENV=production \
    PORT=80 \
    DB_PATH=data/prod.db

EXPOSE 80

CMD ["npm", "start"]
