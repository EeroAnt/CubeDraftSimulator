# CubeDraftSimulator
<!-- ![DraftSimulator](https://github.com/EeroAnt/CubeDraftSimulator/actions/workflows/python-app.yml/badge.svg) -->
## About

### Status:
1.1.0 of the draft app and [the analytics page](https://cubestats-app.azurewebsites.net/) are live now. I will be going over the documentation as a whole soonish.  

### Problems
Playing our MTG Commander Cube is one of my favorite things, but setting up the draft takes hours. The drafting itself can take another four, and then everyone still has to build their decks. If we're lucky, we get to play a single round before the day is over.

Another challenge is managing our 2000+ card cube. Refining it is cumbersome, and making cuts — despite being beneficial for the cube's health — is difficult.

### Solution
A web app solves these problems by:
 - Reducing draft setup from hours of tedious and error-prone card handling to just a few seconds (or maybe a little more).
 - Allowing everyone to draft remotely, so game day is only about playing.
 - Collecting draft data to identify cards that consistently go unpicked, making it easier to refine the cube — even if I’m personally attached to some of them.

## Current Status

Development is ongoing. I've built a text-based interface for managing the database, but there's no live version at the moment since I moved the database off the cloud to cut costs. Keeping it local works fine, as the app only runs when I’m using it. I'm currently working on a major overhaul, and hopefully, a much-improved version will be ready for release soon.

### We are actually live with the following:

 - Encryption for WebSocket communication
 - Enable atypical commanders to be set as commanders (for example Shorikai)
 - refactoring of backend
 - generating url parameters for drafting to persist over reconnecting
 - data migrated from cloud to local server
 - make players queues visible to everyone
 - change the output of draft app to copy to clipboard from downloading a csv
 - redo database
 - limit symbols and length of usernames
 - save drafts to database
 - fix draft setup without commander packs (nodejs read length of rounds rather than checked which round was last and so when commander round (round 0) was missing, the length didn't correspond with the amount of rounds properly..)
 - implemented message queues to front end (incoming) and back end (out going) to increase stability of the communication between them
 - refactor and fix frontend
 - setup local PostgreSQL to listen the app
 - a web page for statistics test

### TODO

 - update readme


### [More technical take](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/technical%20side.md)

<!-- ### [Worklog](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/worklog.md)(in Finnish) -->

## Steps

### Setting up the databases
Database is now local and rework is underway. Azure was good, but it got too costly.

### Setting up the draft
User can choose the ratios of different draft pools and whether they wish to have smaller commander packs to start of the draft.

The default structure for the normal 15 card packs we've used so far:
 - 3 cards from Multicolored card pool
 - 2 cards from each of the single colored pools
 - 3 from colorless (this used to be 2, but I feel the artifacts could use a little more representation) and
 - 2 from lands
 
Shuffle this pack of 18 cards and cut three.

This will be customisable in the next release.

So there's some randomness in each pack. I've also used the cut cards to build up these more random packs to partially to mix it up and partially to keep the distribution in check. Also, we once were close of running out of one of the pools.

8 normal packs of 15 per player, we need 120 cards per player. 120*player_count/18 rounded up tells how many structured packs to build and the rest are made from the leftovers.

### The drafting
Everyone "opens" their packs at the same time, picks a card and passes the rest to the next player. A player can see the next pack only after making the pick and passing the rest of the pack before. After the each pack of the round has been drafted, new packs are "opened" and the order of players is reversed. This countinues from the commander pack throughout all 8 "normal" packs. Here's a view of what it looks at the moment:
![](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/DraftView.PNG)

There is a second view that has more space and information for the deckbuilding part. At the moment it looks like this:
![](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/DeckbuilderView.PNG)

### Outside of the drafting
Due to how I've decided to structure the packs, it doesn't really matter if there's more blue cards than red cards in the cube as they both get a equal representation in each draft apart from the one with more cards will be more diluted in terms of archetypes. This is an actual problem with the cube I have refused to solve for now. The dilution that is. Every color is diluted in a 2000 card cube.

By collecting the drafting data we can see if for some reason or other, one color is picked less than the others so we can try to obtain better and more appealing cards for that color. So far we've just been piling cards that we think we'd like to see in the cube, but the drafting experience would be better with more balanced cube. The plain power of the card is not the only factor to take in of course. Some card has to be the last pick of every pack, but we can identify cards that go unpicked time after time and consider cutting them from the pool. Maybe showcasing some of the most wanted cards too could be fun.

It could be fun also to give post games rankings for the cards as well. Some sort of positive/negative surprise value or maybe mention of a 'hate pick'. A numeric value would help to represent the stats but we could also collect some epic tales of how x card turned the whole game around. I could save the decks as a whole and maybe try to use this with a possible bot in the future.

While drafting and building the deck, it is good to have the statistics interactive in real time, but it might be better to update the pick tables only after the draft part is done.

### Bots
Initially I will implement a simple bot that picks a random card from the pack everytime. Simply to help testing the app and if we want more players to a draft than we have willing humans available. I'll probably disable the pick stats from the bots picks altogether so they don't affect the rankings and I'm considering also disabling them from human players when there's too many bots. Not sure yet.

Somewhere in the more distant future, we can start thinking of an AI for the bots. Well a crude one can be implemented very soon. Use the average pick value from the pick if available, otherwise randomise a value from the pickvalue range and pick the best one available. But a more sophisticated one later on might be cool that recognises it's commanders colors and archetypes even and aims to build and actual, functional deck could be cool. I have no idea how to approach this, but let's not let it stop us.


## License

Copyright (c) 2025 Eero Antikainen
 
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 
 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
