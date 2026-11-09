FROM node:22-bookworm-slim AS dependencies

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
RUN npm_config_build_from_source=true yarn install --frozen-lockfile --production=true

FROM node:22-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./package.json

COPY --chown=node:node config.js ./config.js
COPY --chown=node:node src ./src

RUN mkdir -p /app/logs && chown node:node /app/logs

USER node
CMD ["node", "src/app.js"]
