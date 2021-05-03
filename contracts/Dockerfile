
FROM node:10 as build

WORKDIR /contracts/QuoteContract
COPY ./QuoteContract/package*.json ./

WORKDIR /contracts/QuoteContract
RUN npm cache clean --force
RUN npm clean-install --loglevel verbose

WORKDIR /contracts/QuoteContract
COPY ./QuoteContract .


FROM node:10

WORKDIR /usr/src/contracts

COPY --from=build /contracts/QuoteContract/ .

EXPOSE 3001

CMD [ "node", "bin/www" ]
