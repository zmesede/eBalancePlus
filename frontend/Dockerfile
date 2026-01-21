FROM node:18-alpine AS build-stage

WORKDIR /app
RUN corepack enable

# Dépendances
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Fichiers de config (OBLIGATOIRES pour vue-tsc)
COPY vite.config.ts .
COPY tsconfig.json .
COPY tsconfig.node.json .

# Code source
COPY index.html .
COPY src ./src
COPY public ./public

# Build (vue-tsc + vite)
RUN pnpm build

FROM nginx:stable-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
