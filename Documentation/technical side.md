## The idea:

!()[https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/Architecture.PNG]

## So far I have:

 - build the PostgreSQL database that is up and running in Azure
 - set up the Flask API server to be called with a token and a player count locally
 - CI-pipeline for the Flask API communnicating with the database

## Next up:

 - Deploy the Flask API server

## To do:

 - Learn how to handle the draft with websockets and NodeJS
 - Deploy that
 - Build the React App for UI