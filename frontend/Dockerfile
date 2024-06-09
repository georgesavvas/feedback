FROM node:16.1.0-alpine as build
ARG UID
ARG GID

WORKDIR /app

COPY source/package*.json ./

RUN npm install

COPY source .

RUN npm run build

# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# CMD ["nginx", "-g", "daemon off;"]

FROM node:16.1.0-alpine

WORKDIR /app
COPY --from=build /app/build build

WORKDIR server
RUN ["npm", "init", "-y"]
RUN ["npm", "install", "express", "morgan"]
COPY server .

CMD ["node", "server.js"]
