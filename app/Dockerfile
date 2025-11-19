# -----------------------------------
# STAGE DEV — usado no docker-compose
# -----------------------------------
FROM node:22-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:debug"]
# -----------------------------------
# STAGE BUILD — usado apenas p/ PRODUÇÃO
# -----------------------------------
FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# -----------------------------------
# STAGE PROD — se precisar no futuro
# -----------------------------------
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
