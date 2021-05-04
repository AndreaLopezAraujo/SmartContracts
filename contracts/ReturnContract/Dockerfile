FROM node:10 as build

WORKDIR /contracts/ReturnContract
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 3005

CMD [ "node", "bin/www" ]