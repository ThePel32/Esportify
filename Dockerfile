FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --prod

FROM nginx:alpine
COPY --from=builder /app/dist/esportify /usr/share/nginx/html
EXPOSE 80
