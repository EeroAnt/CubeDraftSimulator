## The idea:

![](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/Architecture.PNG)

## So far I have:

 - built the PostgreSQL database that is up and running in Azure which can be accessed via the Flask API
 - deployed the Flask API
 - CI-pipeline for the Flask API communnicating with the database

## Next up:

 - Learn how to handle the draft with websockets and NodeJS backend

## To do:

 - Deploy the nodejs backend
 - Build the React App for UI

### The Database
Is a PostgreSQL database and it is online in Azure Cloud

#### The cards
Initial Cards table has been setup. Contents mirror the cubes content in [cubecobra](https://cubecobra.com/cube/overview/58otz).

The table, 'Cards', would have columns for id, name, manavalue, color identity, types, textbox, image url, backside image url, draft pool.

Most of this is quite straight forward, but for the non-trivial columns my initial solutions would be:
 - I've used to divide the cube into several draft pools to ensure that different colors, lands and so on have a somewhat even distribution. Cards with a color identity can be automatically assigned to that draft pool, but multicolored, colorless and lands I've divided in such a way that I probably have to input those manually myself.
 - Color identity can be expressed with a text WUBRGC. **W**hite Bl**u**e, **B**lack, **R**ed, **G**reen and **C**olorless
 - I'll just save the type line as whole and filter from there
 - Backsides will have their image urls stored

#### The picks
The table, 'Picks', has columns id, card id (reference to main table), pick number, commander pick number. It enables ranking the cards by how fast were they picked from normal packs or from commander packs for commanders. It is also easy to filter out those cards that have been present in the draft for n times only.

#### The commanders
The commander pool is stored as a table, Commanders, with columns of id and card_id (again reference to main table). This could've been a column in the main table, but I went with this now.

### Setting up the draft
This part happens in the Flask server that is also online in Azure Cloud.

#### GET-request
A GET-request in the form of <BASE URL>/<Player count>/<token> is responded with a json containing a correctly setup packs for each player for each round and also the 'table' which has 'seats' which is a dict containing empty lists for main deck, side deck, current pack, and queue for packs for every player 

This can be tested in https://cubedraftsimuflaskapi.azurewebsites.net/. It is running on a free tier so it probably takes a little while to start up a container. Once it is running it is quite fast with providing the json. Player counts supported now are 4-9 and token can be any string. For example: https://cubedraftsimuflaskapi.azurewebsites.net/6/kUvq2