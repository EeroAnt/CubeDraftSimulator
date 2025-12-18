# React Frontend

## Purpose
Single-page application that provides the user interface for the MTG Commander Cube draft. Handles all user interactions from login through draft completion, maintains synchronized state via WebSocket, and provides deck building tools.

## Accessed by
- Users via web browser
- Communicates with Node.js backend over WebSocket

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Application Shell                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  main.jsx ──► BrowserRouter ──► App.jsx                                     │
│                                    │                                        │
│                                    ▼                                        │
│                             useGameState()                                  │
│                     ┌──────────────┴──────────────┐                         │
│                     │     Central State Hook      │                         │
│                     │  • WebSocket connection     │                         │
│                     │  • All application state    │                         │
│                     │  • Message handling         │                         │
│                     │  • URL synchronization      │                         │
│                     └──────────────┬──────────────┘                         │
│                                    │                                        │
│              ┌─────────────────────┼─────────────────────┐                  │
│              ▼                     ▼                     ▼                  │
│         mode="Home"          mode="Lobby"          mode="Draft"             │
│              │                     │                     │                  │
│              ▼                     ▼                     ▼                  │
│      ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐           │
│      │    Home      │    │    Lobby     │    │      Draft       │           │
│      │  ├─Login     │    │  ├─Success   │    │  ├─Pack View     │           │
│      │  ├─Menu      │    │  ├─Full      │    │  ├─Waiting View  │           │
│      │  ├─Create    │    │  ├─Failed    │    │  └─Deckbuilder   │           │
│      │  └─Join      │    │  └─Started   │    │                  │           │
│      └──────────────┘    └──────────────┘    └──────────────────┘           │
│                                                       │                     │
│                                                       ▼                     │
│                                              ┌──────────────────┐           │
│                                              │    PostDraft     │           │
│                                              │  • Deckbuilder   │           │
│                                              │  • Export        │           │
│                                              └──────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── Components/
│   ├── App/              # Root component, mode routing
│   ├── Home/             # Login, menu, draft creation/joining
│   ├── Lobby/            # Waiting room before draft starts
│   ├── Draft/            # Active drafting interface
│   ├── PostDraft/        # Post-draft deckbuilding
│   ├── Deckbuilder/      # Card display, filtering, curve visualization
│   ├── NavBar/           # Draft and post-draft navigation bars
│   ├── SideBar/          # Card list, commander management
│   ├── Buttons/          # Reusable button components
│   ├── Forms/            # Input forms and parameter controls
│   ├── CardImage/        # Card image display with flip support
│   └── index.js          # Component exports
├── Hooks/
│   ├── useGameState.jsx  # Central state management hook
│   └── index.js
├── Services/
│   ├── Encryption.js     # XOR cipher for WebSocket messages
│   ├── sendMessage.jsx   # Encrypted message sending
│   ├── Reconnect.jsx     # Session restoration logic
│   ├── DraftSetup.jsx    # Draft creation message
│   ├── GetSeatToken.jsx  # Seat token request
│   ├── Packs.jsx         # Unused legacy endpoint
│   └── index.js
└── main.jsx              # Application entry point
```

---

## Core Components

### main.jsx — Entry Point

Renders the application root with React Router's `BrowserRouter` for URL-based state persistence.

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

### App.jsx — Mode Router

Consumes `useGameState()` and conditionally renders the appropriate view based on `mode`:

| Mode | Component | Description |
|------|-----------|-------------|
| `"Home"` | `<Home />` | Login, menu, draft creation/joining |
| `"Lobby"` | `<Lobby />` | Pre-draft waiting room |
| `"Draft"` | `<Draft />` | Active drafting interface |
| `"Post Draft"` | `<PostDraft />` | Deckbuilding and export |
| `"Waiting"` | `<WaitingRoom />` | Server response pending |

All game state is passed as props via spread operator: `<Home {...gameState} />`

---

## State Management

### useGameState.jsx — Central State Hook

The application's "engine" — a custom React hook that manages all state, WebSocket communication, and URL synchronization.

#### State Categories

**Session State:**
| State | Type | Purpose |
|-------|------|---------|
| `mode` | string | Current view (Home, Lobby, Draft, etc.) |
| `homeMode` | string | Sub-view within Home (Login, Menu, Create, Join) |
| `username` | string | Player's display name |
| `token` | string | Draft identifier |
| `seatToken` | string | Player's seat identifier for reconnection |
| `owner` | string | "T" if draft creator, "F" otherwise |

**Draft State:**
| State | Type | Purpose |
|-------|------|---------|
| `round` | number | Current draft round (0 = commanders) |
| `pack` | array | Cards in current pack |
| `queues` | array | All players' pack queue status |
| `canalDredger` | string | "T" if player gives last cards to Dredger holder |

**Deck State:**
| State | Type | Purpose |
|-------|------|---------|
| `main` | array | Cards in main deck |
| `side` | array | Cards in sideboard |
| `commanders` | array | Selected commanders (max 2) |
| `commanderColorIdentity` | array | Combined color identity of commanders |
| `mainColorIdentity` | array | Colors present in main deck |

**UI State:**
| State | Type | Purpose |
|-------|------|---------|
| `showMain` | boolean | Display main deck vs sideboard |
| `showDeckbuilder` | boolean | Show deckbuilder vs pack view |
| `selectedCards` | array | Currently selected cards for bulk operations |
| `selectedCommanders` | array | Currently selected commander |
| `lastClicked` | object | Last clicked card (for sidebar preview) |
| `cardsToDisplay` | array | Filtered cards for deckbuilder |
| `typeFilter` | array | Active type filters |
| `colorFilterPos` | array | Include colors filter |
| `colorFilterNeg` | array | Exclude colors filter |

**Curve State:**
| State | Type | Purpose |
|-------|------|---------|
| `curveOfMain` | array | Mana curve of main deck |
| `curveOfDisplayed` | array | Mana curve of filtered view |
| `maxManaValue` | number | Highest mana value in pool |

**Lobby State:**
| State | Type | Purpose |
|-------|------|---------|
| `lobbyMode` | string | Lobby sub-state (Success, Full, Failed, Started) |
| `playerList` | object | UUID → username mapping |
| `playersInLobby` | number | Current player count |
| `drafts` | array | Available drafts for joining |
| `hasNPC` | boolean | Whether lobby contains AI drafters |
| `numberOfPlayers` | number | Target player count |
| `draftInitiated` | boolean | Draft setup in progress |

#### WebSocket Connection

Uses `react-use-websocket` library for WebSocket management:

```javascript
const connection = useWebSocket(import.meta.env.VITE_REACT_APP_WS_URL, {
  share: true,
  onOpen: () => reconnect(...),
  onMessage: (e) => decrypt → parse → queue → process
})
```

**Message Flow:**
1. Receive encrypted base64 message
2. Decrypt using XOR cipher
3. Sanitize string (remove control characters)
4. Parse JSON
5. Deep-sanitize all string values
6. Push to message queue
7. Process queue sequentially
8. Send acknowledgment back to server

**Reconnection Logic:**
On WebSocket open, `reconnect()` determines session state from URL params:
- Has username + token + seatToken → Rejoin active draft
- Has username + token → Rejoin lobby
- Has username → Login with existing name
- Nothing → New connection

#### URL Synchronization

State is persisted to URL search params for refresh/reconnection:

| Mode | Params |
|------|--------|
| Home | `u` (username), `d` (token), `h` (homeMode) |
| Lobby | `u`, `d`, `n` (players), `p` (in lobby), `s` (seat), `o` (owner) |
| Draft | `u`, `d`, `s`, `r` (round), `o`, `cd` (canal dredger), `m` |
| Post Draft | `u`, `d`, `s`, `o`, `m` |

#### Message Handling

The `useEffect` on `decryptedMessage` routes responses by mode and message type:

**Home Mode:**
- `drafts` array → Updates available drafts (Join view)
- `Playerlist` or `Setup OK` → Transition to Lobby
- `Setup Failed` → Alert and reset

**Lobby Mode:**
- `players` object → Update player list, check for NPCs
- `Start Draft` → Transition to Draft
- `Lobby Full` / `Draft Already Started` → Show error state

**Draft Mode:**
- `DraftState` → Update pack, queues, deck zones, round
- `Post Draft` → Transition to PostDraft
- `End Draft` → Transition to DeckBuilder

**Post Draft / DeckBuilder:**
- `Picked Cards` → Sync deck state

#### Computed Values

Color identities are derived from commanders and main deck:

```javascript
// Commander color identity
useEffect(() => {
  if (commanders.length === 0) setCommanderColorIdentity(["C"])
  else if (commanders.length === 1) setCommanderColorIdentity(commanders[0].color_identity.split(""))
  else {
    // Combine both commanders, remove "C" if multiple colors
    const combined = [...new Set([...commanders[0].color_identity.split(""), ...commanders[1].color_identity.split("")])]
    setCommanderColorIdentity(combined.length < 2 ? combined : combined.filter(c => c !== "C"))
  }
}, [commanders])
```

#### Wizard Selection

Random wizard image selection changes each round and on initial load:

```javascript
useEffect(() => {
  setWizardSelection(Math.floor(Math.random() * 3) + 1)
}, [round])
```

---

## Services Layer

### Encryption.js

XOR cipher matching the backend implementation for message obfuscation.

**`encrypt(text, key)`**
- XORs each character with extended key
- Returns base64-encoded result

**`decrypt(base64, key)`**
- Decodes base64 to bytes
- XORs with extended key
- Returns UTF-8 decoded string

### sendMessage.jsx

Wrapper for sending encrypted messages:

```javascript
export function sendMessage(connection, message) {
  const parsed = JSON.stringify(message)
  const encryptedMessage = encrypt(parsed, key)
  connection.sendMessage(encryptedMessage)
}
```

### Reconnect.jsx

Determines reconnection strategy based on available session data:

| Condition | Message Type | New Mode |
|-----------|--------------|----------|
| username + token + seatToken | `Rejoin Draft` | Draft |
| username + token | `Rejoin Lobby` | Lobby |
| username only | `Login` | Home |
| Nothing | `Connect` | Home |

### DraftSetup.jsx

Constructs and sends the `Create Lobby` message with all configuration parameters:
- `token`, `player_count`, `number_of_rounds`
- `multi_ratio`, `generic_ratio`, `colorless_ratio`, `land_ratio`
- `commander_pack_included`

Sets mode to "Waiting" while server processes.

### GetSeatToken.jsx

Requests seat token from server (used for reconnection persistence).

---

## UI Components

### Buttons.jsx

**`Button`** — Standard clickable button with customizable className
**`FormSubmitButton`** — Submit button for forms

### CardImage.jsx

**`Image`** — Card image with optional flip functionality for double-faced cards
- Click toggles between front and back
- Single-faced cards ignore clicks

**`ManaSymbol`** — Renders mana symbol from Scryfall CDN
**`ManaFilter`** — Clickable mana symbol for filtering

### Forms.jsx

**`Form`** — Text input with submit (used for login)
- Strips non-alphanumeric characters
- 16 character limit

**`DraftParametersForm`** — Numeric input for draft configuration
**`DraftParameterCheckbox`** — Boolean toggle for draft options
**`Filter`** — Generic text filter input

### NavBar.jsx

**`DraftNavbar`** — Active draft navigation
- Shows/hides deckbuilder toggle
- Displays current round
- Shows player queue status (bold = has pack in hand)

**`PostDraftNavBar`** — Post-draft navigation
- Basic land counters with +/- buttons
- Copy deck to clipboard (Cockatrice format)
- Draft data validation buttons (owner only)

### SideBar.jsx

Persistent sidebar showing:
- Last clicked card preview (full image)
- View toggle (Main/Side)
- Card movement buttons
- Commander appointment/removal
- Commander list with color identity
- Scrollable card list (main or side)
- Card count with color identity symbols

**Commander Validation:**
- Must be Legendary Creature OR have "can be your commander" text
- Max 2 commanders
- Partner rule: both must have ≤2 colors and neither can be a God

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_REACT_APP_WS_URL` | WebSocket server URL |
| `VITE_MY_ENCRYPTION` | Shared encryption key |

---

## View Documentation

For detailed documentation of each view's components and interactions, see:
- [View Components](./Frontend_Views.md) — Home, Lobby, Draft, PostDraft

---

## Notes

- All state flows through `useGameState` — components are stateless consumers
- URL params enable full session restoration on page refresh
- Message queue ensures sequential processing of rapid server updates
- Wizard images provide visual feedback during wait states
- Canal Dredger handling is threaded throughout Draft components
- Color identity computation follows MTG Commander rules