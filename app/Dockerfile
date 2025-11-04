FROM node:22-alpine AS build
ARG buildcmd="npm run build:prod"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ${buildcmd}
FROM node:22-alpine AS package
ARG HEAP_SIZE=384
ENV HEAP_SIZE=${HEAP_SIZE}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --frozen-lockfile --production=true --legacy-peer-deps
RUN npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
USER node
CMD node --max-old-space-size=${HEAP_SIZE} dist/main