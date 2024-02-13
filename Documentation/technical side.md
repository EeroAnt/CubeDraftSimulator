## The idea:

![](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/Architecture.PNG)

## About the architecture
This project has multiple motivations. The highest probably is that I want this app. Second one is that as I've been applying for my first IT-job, I've noticed experience/knowledge of big cloud service providers such as AWS, Azure and GCP is seen as an advantage. So I decided to tackle Azure to get even some understanding of it. Last one is the possibility of submitting this project as a Full stack project for my studies. This is the motivation to build the simulator as a single page React app with NodeJS backend.

Having no prior experience on Azure or container technology and only the first three chapter of the [full stack course](https://fullstackopen.com) under my belt, I set on this journey. I am very pleased that I have almost got a minimum viable product online. I ended up with current deployment solution through trial and error basically. I quickly discovered that even my Flask API was not easily deployed to Azure via Azure's default containerizing service so I had to research how to create the container myself and to set up a Container Registry in Azure (ACR). After successfully doing this I got the Flask API deplyed as a Azure Web App. I had bigger problems with deploying the React app with the backend. I couldn't make it work as a Web App nor a Container App after multiple attempts. One thing that was in the way, was my websocket setup being not secure (ws). I took a glance on the subject I decided, at least for now, setting up licences and everything for secure websockets is too much for this project. I have no permanent users, no passwords of any kind, all messages between the client interface and the backend consist of interacting with the draft. Only permanent data is the cube itself and soon the data about picks made. I decided that http is good enough (for now). With Azure Container Instances (ACI), I was finally able to get my two container network running.

Now I know how to manage permissions in Azure, push images to ACR, deploy and redeploy a ACI, write simple dockerfiles for these apps and API's and build the images with docker-compose, use websockets to handle React app to NodeJS communication. I also learned that working 16 hours a day on project is not very healthy.

This is a hobby project and I want to keep expences low. The ACI solution is great for this aspect too. It seems that running these containers cost me around 1€ per day. Without the app we have played drafted the cube once a year on average. I hope that with it we will do so more frequently. But sinse the only users (for now) are me and my friends, I'm just going to start it up when needed and pay <50 cents for the draft. The container registry costs me less than 5€ a month. However, there is a downside. The only part of my App that is live around the clock is the Flask API so this is not the best option for a portfolio, I suppose. I think I could make the draft statistics visible on the Flask Web App, so at least that would be accessible anywhere anytime. That seems sensible as it is the piece communicating with the database already, but we need to draft first to get some data, so I'll look into that in the future.

If you are here reading this and would like to see the simulator in action, I'm more than happy to start it up and keep it running for couple of days.

Also please note that as my highest motivation is to get this up and running and I didn't know what I was doing, the coding practices are not optimal. After I get MVP online, I'll start refining the project as a whole.

## So far I have:
 - built the PostgreSQL database that is up and running in Azure which can be accessed via the Flask API
 - deployed the Flask API as a Azure Web App
 - CI-pipeline for the Flask API communnicating with the database
 - NodeJS backend and the React app are live as a Azure Container Instance in separate containers.
 - MVP is online. User can draft, refine their decks, export them as csv, data from drafts is gathered and saved to the database, if opted.

## To do/Backlog:
 - Start refactoring the NodeJS backend and the React App
 - Build atleast CI if not also CD pipelines for NodeJS and React parts
 - Build tutorial for the App
 - Add support for gathering draft data
 - Add color-identity filters to the deckbuilders
 - Add an element to show your commanders color-identities
 - Add logic to inform user whether their deck is legal or not
 - Add a view to show illegal cards in main deck
 - Add bars/graphs to show the mana value curves of main/picked/filtered cards
 - Add a forms to filter names and/or types with input. Maybe text boxes too

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
A GET-request in the form of BASE URL/Player count/token is responded with a json containing a correctly setup packs for each player for each round and also the 'table' which has 'seats' which is a dict containing empty lists for main deck, side deck, current pack, and queue for packs for every player 

This can be tested in https://cubedraftsimuflaskapi.azurewebsites.net/. It is running on a free tier so it probably takes a little while to start up a container. Once it is running it is quite fast with providing the json. Player counts supported now are 1-9 and token can be any string. For example: https://cubedraftsimuflaskapi.azurewebsites.net/6/kUvq2

### Drafting
Upon loading the site, a websocket connection is created with the backend. A user is prompted a username and then options are to either initiate a new draft or join an ongoing one with a token. Initiating a draft makes the GET-request mentioned above with selected player count and randomized token. If successful, the user is taken in to lobby for the draft and the token is printed to be shared with others. Once the lobby is full, the initiator of the draft can start the draft.

When the draft starts, players are seated in random order and first round begins. Everyone gets their packs and can begin drafting. A player chooses a card to pick and passes the rest to the next player. During draft there's two views. One for the actual drafting and other where user can have a better view of their picks. Once all the cards of the round has been picked, the passing order is reversed and new packs are dealt.

The back end keeps track of everyones picks, mains, sides and commanders. When user makes change to any of these, the change is messaged to the backend and the backend responds with updated contents of this users situation.

Once seated, every user sees two tokens in the upper right corner of their screen. One for the draft and one for the seat. If a draft is in a lobby, submitting that drafts token takes you to the lobby, given that there is room for another player. If the draft is ongoing and has an empty seat, submitting that drafts token prompts user for a seat token. If a token for a empty seat is given, the user will be seated and the draft may continue.

### After drafting
The same deck building view persists with a couple of changes. There's no player order, so neighbours are not printed, and there's no reason to swap views. There's a link to download the deck as a csv file in the navigation bar instead.
