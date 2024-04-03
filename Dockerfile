# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]