FROM node:10 as build

WORKDIR /contracts/PrintMoneyContract
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 3004

CMD [ "node", "bin/www" ]