FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS dev-deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Install additional dependencies for database operations
RUN npm install prisma @prisma/client

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Initialize database and start server
CMD npx prisma migrate deploy && npx prisma db seed && node server.js