FROM node:10 as build

WORKDIR /contracts/MoneySeperationContract
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 3003

CMD [ "node", "bin/www" ]