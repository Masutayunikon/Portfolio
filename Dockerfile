FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update && apt-get install -y git

ARG APP_DATA_DIR
ENV APP_DATA_DIR=${APP_DATA_DIR}

# Now GIT_REPO is correctly defined from the ARG passed at build time
# No need to redefine GIT_REPO here with ENV, unless you specifically need it as an environment variable later

# Use ARG to declare GIT_REPO so it can be passed from docker-compose.yml
ARG GIT_REPO

# Log GIT_REPO env var
RUN echo "Cloning from ${GIT_REPO}"

WORKDIR /app

# Use the ARG value here for git clone
RUN git clone ${GIT_REPO} .

# echo ls to see the contents of the cloned repo
# copy ${APP_DATA_DIR}/app.env to /app/.env
COPY ${APP_DATA_DIR}/app.env .env

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output
EXPOSE 3000

# node .output/server/index.mjs
CMD ["node", ".output/server/index.mjs"]

