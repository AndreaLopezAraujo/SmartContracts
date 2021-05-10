FROM node:10 as build

WORKDIR /Tp
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 4004

CMD [ "node", "bin/www" ]
