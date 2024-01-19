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
I'm planning on doing this on a PostgreSQL-database with two tables to begin with, maybe three. Now four

#### The cards
The table 'Cards' would have columns for id, name, manavalue, color identity, types, (tribal?), textbox, image url, draft pool and boolean for backside.

Most of this is quite straight forward, but for the non-trivial columns my initial solutions would be:
 - types could be a string with every letter referencing to a card type. (A)rtifact, (I)nstant, (S)orcery, (C)reature, (B)attle, (E)nchantment, (L)and, (P)laneswalker and Legendar(y) should be enough. (I'm undecided on how to solve Land and Legendary both starting with an L)
 - I've used to divide the cube into several draft pools to ensure that different colors, lands and so on have a somewhat even distribution. Cards with a color identity can be automatically assigned to that draft pool, but multicolored, colorless and lands I've divided in such a way that I probably have to input those manually myself.
 - Color identity can be expressed with a text WUBRGC. **W**hite Bl**u**e, **B**lack, **R**ed, **G**reen and **C**olorless
 - Tribal could store the subtypes as text to be manually filtered possibly
 - Boolean for the backside is for the two sided cards. I'm atm leaning heavily on the three table solution to keep the backsides on a separate table to avoid possible trouble they might cause in the main table of cards.

#### The backsides
Great segway. A database that does not need much more than an id, reference to the cards' main table id and image url.

#### The picks
I don't think that we have cards in the cube that affect the draft itself for now. I'll worry about those cards when it would happen or just decide not to add them. In the normal setting a pack consists of 15 cards and as the power levels of the cards are quite high overall, there is no difference necessary between the first couple of picks. So I think we could start with 10 points for the first three picks, 9 points for the 4th and the 5th and 8 for the following two and then descending after that on every card ending up in 0 points for the last pick. For commander packs (5 cards), think a straight forward 5-4-3-2-1 could work.

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
