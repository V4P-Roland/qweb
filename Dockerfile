# Qalcurate Web is a Vite/React client with a thin Express server. Build the
# static client + server bundle in one stage, then run it on a slim Node
# runtime with only production dependencies.

FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:5000/ >/dev/null || exit 1

CMD ["node", "dist/index.cjs"]
