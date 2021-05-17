FROM node:10 as build

WORKDIR  /contracts/tp1
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 4004

CMD [ "node", "index.js" ]
