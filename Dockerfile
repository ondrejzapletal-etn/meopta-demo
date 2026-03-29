FROM node:24-alpine

ARG LABEL_TITLE
ARG LABEL_DESCRIPTION
ARG LABEL_VERSION
ARG LABEL_REVISION
ARG LABEL_CREATED
ARG LABEL_SOURCE
ARG WORKSPACE

ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs ./${WORKSPACE}/dist ./

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]

LABEL org.opencontainers.image.authors="kontejnery@etnetera.cz" \
      org.opencontainers.image.url="https://doc.etnetera.cz" \
      org.opencontainers.image.title=${LABEL_TITLE} \
      org.opencontainers.image.description=${LABEL_DESCRIPTION} \
      org.opencontainers.image.vendor="Etnetera Core a.s." \
      org.opencontainers.image.version=${LABEL_VERSION} \
      org.opencontainers.image.revision=${LABEL_REVISION} \
      org.opencontainers.image.created=${LABEL_CREATED} \
      org.opencontainers.image.source=${LABEL_SOURCE}
