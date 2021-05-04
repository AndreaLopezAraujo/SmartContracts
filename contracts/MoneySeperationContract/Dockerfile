FROM node:10 as build

WORKDIR /contracts
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 3002

CMD [ "node", "bin/www" ]