FROM node:10 as build

WORKDIR /contracts/QuoteContract
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 3001

CMD [ "node", "bin/www" ]