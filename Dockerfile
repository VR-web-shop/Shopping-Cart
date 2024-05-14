FROM node:14

WORKDIR /app

COPY package*.json ./
COPY .env* ./
COPY .npmrc* ./

RUN npm install

COPY . .

EXPOSE 3004

CMD ["node", "index.js"]
