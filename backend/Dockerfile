FROM node:22-alpine

LABEL org.opencontainers.image.source="https://github.com/THAKUR-ROHIT-21/hireflow-gitops-Thakur"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]