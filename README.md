# CubeDraftSimulator

## About

### Problems
Playing our MTG Commander Cube is one of my favourite things, but setting up the draft takes hours and drafting takes easily 4 more and then everyone still has to finish their decks. So we're lucky, if everyone get's to play a single round, when we would be ready to go.

Another challenge is that refining our 2000+ card monolith of a cube is cumbersome and I find it hard to make cuts, even as they would most probably be beneficial for the health of the Cube.

### Solution
By creating a web app to for this:
 - Setting up the draft goes from multiple hours of dull and error-prone card handling to a click and a handful of seconds (or maybe a little more)
 - Everyone can draft from their homes so the day for the games is only for the games
 - We could collect data from the drafts to see which cards go unpicked, however fond I might be with them

## Steps

### Setting up the databases
I'm planning on doing this on a PostgreSQL-database with two tables to begin with, maybe three.

#### The cards
The table 'Cards' would have columns for id, name, manavalue, color identity, types, textbox, image url, draft pool and boolean for backside.

Most of this is quite straight forward, but for the non-trivial columns my initial solutions would be:
 - I've used to divide the cube into several draft pools to ensure that different colors, lands and so on have a somewhat even distribution. Cards with a color identity can be automatically assigned to that draft pool, but multicolored, colorless and lands I've divided in such a way that I probably have to input those manually myself.
 - Color identity can be expressed with a text WUBRGC. **W**hite Bl**u**e, **B**lack, **R**ed, **G**reen and **C**olorless
 - I'll just save the type line as whole and filter from there
 - Backsides will have their image urls stored

#### The picks
I don't think that we have cards in the cube that affect the draft itself for now. I'll worry about those cards when it would happen or just decide not to add them. In the normal setting a pack consists of 15 cards and as the power levels of the cards are quite high overall, there is no difference necessary between the first couple of picks. So I think we could start with 10 points for the first three picks, 9 points for the 4th and the 5th and 8 for the following two and then descending after that on every card ending up in 0 points for the last pick. For commander packs (5 cards), think a straightforward 5-4-3-2-1 could work.

So I think that this table has columns of id, main table reference id, commander pick points and normal pick points.

#### The commanders
Come to think of it. Easy solution to a problem I did not bring up which is, commanders, is to have them in their own table. Id and and reference to main table. Boom.

### Setting up the draft
First we have the commanders. They are a hand picked bunch of Legendary creatures with more than one colors in their color identity. I randomly choose a commander pack of 5 commanders for each player. Then the rest of the commanders can be shuffled with the card pool of Multicolored.

The structure for the normal 15 card packs I've used is to take:
 - 3 cards from Multicolored card pool
 - 2 cards from each of the single colored pools
 - 2 from colorless and
 - 2 from lands
 
Shuffle this pack of 17 cards and cut two.

So there's some randomness in each pack. I've also used the cut cards to build up these more random packs to partially to mix it up and partially to keep the distribution in check. Also, we once were close of running out of one of the pools.

8 normal packs of 15 per player, we need 120 cards per player. 120*player_count/17 rounded up tells how many structured packs to build and the rest are made from the leftovers.

### The drafting
Everyone "opens" their packs at the same time, picks a card and passes the rest to the next player. A player can see the next pack only after making the pick and passing the rest of the pack before. After the each pack of the round has been drafted, new packs are "opened" and the order of players is reversed. This countinues from the commander pack throughout all 8 "normal" packs. I have made a very crude mock up of what the UI for the drafting could look like:
![](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/First_draft.png)

After the drafting is done, the UI can have more space for the deckbuilding part. Like filter forms for cards's textboxes and tribals, toggles for card type and showing more pictures and toggling between showing main deck cards and side deck cards.

### Outside of the drafting
Due to how I've decided to structure the packs, it doesn't really matter if there's more blue cards than red cards in the cube as they both get a equal representation in each draft apart from the one with more cards will be more diluted in terms of archetypes. This is an actual problem with the cube I have refused to solve for now. The dilution that is. Every color is diluted in a 2000 card cube.

By collecting the drafting data we can see if for some reason or other, one color is picked less than the others so we can try to obtain better and more appealing cards for that color. So far we've just been piling cards that we think we'd like to see in the cube, but the drafting experience would be the better the more balanced the cube is. The plain power of the card is not the only factor to take in of course. Some card has to be the last pick of every pack, but we can identify cards that go unpicked time after time and consider cutting them from the pool. Maybe showcasing some of the most wanted cards too could be fun.

It could be fun also to give post games rankings for the cards as well. Some sort of positive/negative surprise value or maybe mention of a 'hate pick'. A numeric value would help to represent the stats but we could also collect some epic tales of how x card turned the whole game around.

While drafting and building the deck, it is good to have the statistics interactive in real time, but it might be better to update the pick tables only after the draft part is done.

### Bots
Initially I will implement a simple bot that picks a random card from the pack everytime. Simply to help testing the app and if we want more players to a draft than we have willing humans available. I'll probably disable the pick stats from the bots picks altogether so they don't affect the rankings and I'm considering also disabling them from human players when there's too many bots. Not sure yet.

Somewhere in the more distant future, we can start thinking of an AI for the bots. Well a crude one can be implemented very soon. Use the average pick value from the pick if available, otherwise randomise a value from the pickvalue range and pick the best one available. But a more sophisticated one later on might be cool that recognises it's commanders colors and archetypes even and aims to build and actual, functional deck could be cool. I have no idea how to approach this, but neither do have one on implementing the web app either.
