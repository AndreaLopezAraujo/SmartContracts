#!/bin/bash

gnome-terminal --tab -- bash -c "cd ./network/docker-compose-dev; ./down.sh; ./up.sh; bash"

sleep 10
gnome-terminal --tab -- bash -c "cd ./contracts/tp1; npm start; bash"
# gnome-terminal --tab -- bash -c "cd ./containers/client; npm start; bash"

gnome-terminal --tab -- bash -c "cd ./contracts/QuoteContract; npm start; bash"
gnome-terminal --tab -- bash -c "cd ./contracts/PrintContract; npm start; bash"
#gnome-terminal --tab -- bash -c "cd ./containers/app/client; npm start; bash"

rm ./contracts/QuoteContract/data/blocks.json
rm ./contracts/QuoteContract/data/state.json
gnome-terminal --tab -- bash -c "cd ./contracts/ledger_sync; npm start; bash"

