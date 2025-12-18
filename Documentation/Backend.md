# Node.js Backend

## Purpose
Real-time WebSocket server that manages draft sessions, synchronizes state between players, handles pack distribution, and coordinates the entire draft lifecycle from lobby creation to post-draft deckbuilding.

## Accessed by
- React frontend via WebSocket connections
- Flask API indirectly (backend initiates HTTP requests for draft setup)
- NPC system (AI drafters interact through the same state and pick mechanisms)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Connection Layer                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  WebSocket Server (port 3001)                                               │
│       │                                                                     │
│       ▼                                                                     │
│  New Connection ──► UUID assigned ──► Message queue created                 │
│       │                                                                     │
│       ▼                                                                     │
│  handleMessage() ──► decrypt ──► route by type ──► execute action           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │  Lobby   │   │  Draft   │   │   Deck   │
              │  Setup   │   │  Engine  │   │ Building │
              └──────────┘   └──────────┘   └──────────┘
                    │               │               │
                    ▼               ▼               ▼
              createLobby    handlePick      setCommander
              joinLobby      passPackTo...   moveCards
              startDraft     dealPacks       removeCommander
```

## Core Components

### index.js — Server Entry Point

Initializes the HTTP server, WebSocket server, and global intervals.

**Startup Sequence:**
1. Creates HTTP server and WebSocket server on port 3001
2. On each new connection:
   - Assigns a UUID to the connection
   - Initializes an empty message queue
   - Starts a 200ms interval for processing queued messages
   - Creates a user object with empty username and token
3. Registers `handleMessage` and `handleClose` event handlers
4. Starts a 2-second interval for broadcasting lobby updates

**Global Error Handling:**
- Catches uncaught exceptions and unhandled promise rejections
- Logs errors without crashing the server

---

### State.js — Centralized State Store

All server state is stored in exported objects. No database persistence during active drafts — state lives in memory.

| Export | Purpose |
|--------|---------|
| `connections` | Map of UUID → WebSocket connection |
| `users` | Map of UUID → user object (username, token, seat reference) |
| `drafts` | Map of draft token → draft object |
| `intervalIDs` | Map of UUID/token → interval references for cleanup |
| `messageQueues` | Map of UUID → array of pending messages |
| `last_acked_message` | Tracks last acknowledged message per connection |
| `retryCounts` / `retryTimers` | Retry state for unacknowledged messages |
| `broadcastedQueues` / `draftStates` | Deduplication state for broadcasts |
| `lastBroadcastTimestamps` | Throttling for periodic broadcasts |
| `npcStates` | Map for NPC-specific state (used by AI module) |
| `clientIndex` | Round-robin index for LLM client rotation |

**Note:** The `nextClientIndex(total)` function rotates through LLM endpoints and is used by the AI module.

---

### WebSocketHandler.js — Message Router

Central dispatcher that decrypts incoming messages and routes them to appropriate handlers.

**Message Flow:**
1. Receive raw WebSocket message
2. Decrypt using XOR cipher with shared key
3. Parse JSON and extract message type
4. Route to handler based on type
5. Handler queues response via `queueMessage()`

**Supported Message Types:**

| Type | Handler | Description |
|------|---------|-------------|
| `Connect` | — | Logs new connection |
| `Login` | — | Sets username on user object |
| `Create Lobby` | `createLobby()` | Initializes new draft via Flask API |
| `Get Lobbies` | `broadcastLobbies()` | Marks user as browsing lobbies |
| `Join Lobby` | `joinLobby()` | Adds user to existing draft |
| `Rejoin Lobby` | `joinLobby()` | Reconnects with username restoration |
| `Start Draft` | `startDraft()` | Begins draft, assigns seats |
| `Pick` | `handlePick()` | Processes card selection |
| `Give Last Card` | `giveLastCard()` | Canal Dredger special ability |
| `Set Commander` | `setCommander()` | Moves card to commander zone |
| `Remove Commander` | `removeCommander()` | Returns commander to main/side |
| `Move Cards` | `moveCards()` | Transfers cards between zones |
| `Rejoin Draft` | `rejoinDraft()` | Reconnects to in-progress draft |
| `Draft Data Decision` | `sendDraftData()` | Submits results to database |
| `Get Seat Token` | — | Returns player's seat token |
| `Add NPC` | `addNPC()` | Adds AI drafter to lobby |
| `Remove NPC` | `removeNPC()` | Removes AI drafter from lobby |
| `Ack` | — | Acknowledges received message |

**Connection Cleanup (`handleClose`):**
- Clears message processing interval
- Removes player from draft's player list
- Clears seat assignment
- Broadcasts updated player list
- Deletes user and connection from state

---

### Messaging.js — Reliable Message Delivery

Implements a reliable messaging layer with acknowledgment and retry logic.

**Message Queue System:**
- Each connection has its own FIFO queue
- Messages are processed every 200ms via interval
- Only one unacknowledged message allowed in flight per connection

**Delivery Flow:**
```
queueMessage() ──► Add token ──► Push to queue
                                      │
processMessageQueue() ◄───────────────┘
        │
        ▼
   No pending ack? ──► Encrypt ──► Send ──► Set ack token ──► Start retry timer
        │
        ▼
   Waiting for ack ──► Skip (will retry)
```

**Retry Mechanism:**
- `MAX_RETRIES`: 5 attempts
- `RETRY_DELAY`: 2000ms between attempts
- On max retries: drops message, clears ack state, processes next
- On successful ack: clears timer, shifts queue, processes next

**Message Token:**
Each message gets a UUID token (`ackToken`) added before sending. The client must echo this token back in an `Ack` message.

---

### Broadcasts.js — State Synchronization

Pushes state updates to connected players.

**Broadcast Functions:**

| Function | Trigger | Recipients | Content |
|----------|---------|------------|---------|
| `broadcastUserlist` | Player joins/leaves | All players in draft | Player UUIDs, usernames, NPC flag |
| `broadcastLobbies` | 2-second interval | Users browsing lobbies | Available drafts with player counts |
| `broadcastDraftStatus` | State transitions | All players in draft | Status type (e.g., "Start Draft", "Post Draft") |
| `broadcastDraftState` | 500ms interval during draft | All players in draft | Round, pack contents, picked cards, queues |

**Deduplication & Throttling:**
- `broadcastDraftState` compares current state against `draftStates[uuid]` and `broadcastedQueues[token]`
- Skips broadcast if state unchanged AND less than 10 seconds since last broadcast
- Forces broadcast after 10 seconds regardless of changes (heartbeat)

**Queue Extraction:**
The `extractQueues()` function builds a summary of each player's status:
```javascript
{
  username: "Player1",
  seat: 0,
  queue: 2,    // Packs waiting
  hand: 1      // Currently holding a pack (0 or 1)
}
```

---

### DraftSetup.js — Lobby and Draft Initialization

Handles the setup phase from lobby creation through draft start.

**`createLobby(data, uuid)`**
1. Validates user isn't already in a draft
2. Calls Flask API with configuration parameters:
   - `player_count`, `token`, `commander_pack_included`
   - `number_of_rounds`, ratio settings (multi, generic, colorless, land)
3. On success:
   - Stores draft in `drafts` state
   - Broadcasts player list
   - Starts 5-second status check interval

**`joinLobby(data, uuid)`**
- Validates: draft exists, not full, not already started
- Adds user to draft's player list
- Clears user's lobby browsing flag
- Broadcasts updated player list

**`startDraft(data)`**
1. Sets draft state to `'drafting'`
2. Broadcasts "Start Draft" status
3. Shuffles player order
4. Initializes pick tracking arrays
5. Assigns players to seats (seat0, seat1, ...)
6. Links seat references to user objects
7. Clears setup interval, starts 500ms draft status interval

**`rejoinDraft(data, uuid)`**
- Matches seat token to reconnect player
- Restores seat reference
- If in deckbuilding phase, sends current card state

---

### DraftFunctions.js — Pick Processing

Core draft mechanics for card selection and pack passing.

**`handlePick(data, draft, userSeat, uuid)`**

Main pick handler:
1. Shuffles pack (prevents position-based inference from timing)
2. Finds selected card in pack
3. Calls `pickCard()` to move card to zone
4. Calls `updateDraftPicks()` to record pick
5. Checks for Canal Dredger (card ID 1887) special handling
6. Calls `passPackToNextPlayer()`

**`pickCard(zone, cardToAdd, userSeat)`**
- Adds card to specified zone (`main` or `side`)
- Removes card from pack at hand

**`updateDraftPicks(draft, pickedCard, userSeat)`**
- Records pick in `draft.picks` or `draft.commanderpicks` (round 0)
- Pick object includes card ID and pick number (position in pack)
- NPC picks recorded as ID 0 (not tracked for stats)
- When pack is emptied, records full pick order in `draft.picked_packs`

**`passPackToNextPlayer(draft, userSeat)`**
- Calculates next seat based on `draft.direction` (+1 or -1)
- Adds pack to next player's queue
- Clears current player's pack at hand

**`giveLastCard(draft, pack)`**

Special function for Canal Dredger ability:
- Finds seat with Canal Dredger token
- Adds remaining pack to that seat's queue

**`sendCards(uuid, userSeat)`**
- Sends current deck state (commanders, main, side) to player
- Used for reconnection and deckbuilding phase

---

### DraftState.js — State Extraction

Prepares draft state for broadcasting.

**`extractDraftState(draft, player)`**

Returns player-specific view:
```javascript
{
  round: 2,
  seat: "abc123",           // Seat token for reconnection
  packAtHand: [...cards],   // Current pack contents
  commanders: [...cards],
  main: [...cards],
  side: [...cards],
  canalDredger: "true"      // Whether this player passes last cards to Dredger
}
```

**`extractQueues(draft)`**

Returns array of player statuses sorted by seat number (see Broadcasts section).

**`handleCanalDredger(draft, uuid)`**

When Canal Dredger is picked:
1. Finds picker's seat
2. Marks that seat's token as `draft.canalDredger`
3. Sets `canalDredger` flag on all other seats to `"true"`
4. Picker's own flag stays `"false"` (doesn't give cards to self)

---

### DraftStatus.js — Draft Lifecycle Management

Monitors draft progress and handles state transitions.

**`checkDraftStatus(draft)`**

Called every 500ms during active draft:

| Condition | Action |
|-----------|--------|
| Drafting + players present + round complete | Advance to next round |
| All rounds complete | Transition to deckbuilding |
| Drafting + no human players | Mark as disconnected |
| State is 'done' | Clear intervals, broadcast end |
| Setup Complete + no humans | Delete lobby |
| Any other empty state | Clear intervals |

**`goToNextRound(draft)`**
- Increments round counter
- Reverses pack direction (snake draft)
- Deals new packs from `draft.rounds[round]` to each seat's queue

**`dealPacks(draft)`**

Moves packs from queue to hand:
- For each seat with empty hand and non-empty queue
- Shifts first pack from queue to `packAtHand`

**`clearNPCIntervals(draft)`**
- Cleans up NPC processing intervals when draft ends or disconnects

---

### DeckManagement.js — Post-Pick Card Organization

Handles card movement within a player's pool.

**`setCommander(data, userSeat)`**
- Finds card by ID in main or side
- Moves to `commanders` array
- Removes from original zone

**`removeCommander(data, userSeat)`**
- Moves card from commanders to specified zone (`main` or `side`)
- Uses `data.zone` to determine destination

**`moveCards(data, userSeat)`**
- Bulk move operation
- Iterates through `data.cards` array
- Moves each from `data.from` zone to `data.to` zone
- Checks for duplicates before adding

---

### encryption.js — Message Encryption

Simple XOR cipher for WebSocket message obfuscation.

**`encrypt(text, key)`**
1. Encode text to bytes
2. Extend key to match text length (repeat + truncate)
3. XOR each byte with corresponding key byte
4. Return base64-encoded result

**`decrypt(base64, key)`**
1. Decode base64 to byte array
2. Extend key to match length
3. XOR each byte with key byte
4. Return decoded string

**Note:** This is obfuscation, not security. The shared key is stored in environment variables and provides minimal protection against casual inspection.

---

## Data Structures

### Draft Object
```javascript
{
  token: "draft-abc123",
  state: "drafting",           // "Setup Complete" | "drafting" | "deckbuilding" | "done" | "disconnected"
  player_count: 4,
  players: [...userObjects],
  table: {
    seat0: { token, player, queue, packAtHand, main, side, commanders, number },
    seat1: { ... },
    ...
  },
  rounds: {
    0: { pack0: {...}, pack1: {...}, ... },  // Commander packs
    1: { pack0: {...}, pack1: {...}, ... },  // Round 1
    ...
  },
  round: 1,
  last_round: 8,
  direction: 1,                // 1 = left, -1 = right
  picks: [],                   // Pick records for stats
  commanderpicks: [],
  picked_packs: [],            // Complete pack pick orders
  canalDredger: null           // Seat token of Canal Dredger holder
}
```

### User Object
```javascript
{
  uuid: "connection-uuid",
  username: "PlayerName",
  token: "draft-abc123",       // Current draft token
  seat: { ... },               // Reference to seat in draft table
  draftSelection: false,       // Browsing lobbies flag
  isNPC: false                 // AI drafter flag
}
```

### Pack Object
```javascript
{
  cards: [
    { id: 1323, name: "Card Name", ... },
    ...
  ],
  picks: [123, 456, ...]       // Card IDs in pick order
}
```

---

## Intervals and Timers

| Interval | Frequency | Purpose |
|----------|-----------|---------|
| Lobby broadcasts | 2000ms | Push available drafts to browsing users |
| Message queue processing | 200ms | Process pending messages per connection |
| Draft status check (setup) | 5000ms | Monitor lobby state |
| Draft status check (active) | 500ms | Advance rounds, deal packs, broadcast state |
| NPC processing | 200ms | Trigger AI picks (managed by NPC module) |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `MY_ENCRYPTION` | Shared key for XOR message encryption |
| `MODEL` | Azure OpenAI deployment name (for NPCs) |
| `ENDPOINT_*` / `KEY_*` | Regional LLM endpoint credentials |

---

## Notes

- All state is ephemeral — server restart loses active drafts
- NPCs use the same seat structure as humans, making them interchangeable from the draft engine's perspective
- The 500ms draft check interval balances responsiveness with CPU usage
- Message acknowledgment prevents lost picks due to network issues
- Pack shuffling before picks prevents timing-based information leakage
- Canal Dredger is a special MTG card (ID 1887) that receives the last card from each pack