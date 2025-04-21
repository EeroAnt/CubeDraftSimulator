# Flask API

## Purpose
Serves as the backend interface for managing draft setup and handling draft data transmission between the frontend and the local PostgreSQL database. It provides a minimal but essential set of endpoints for initializing drafts and receiving results.

## Accessed by
- The Node.js backend, which makes HTTP requests to trigger draft generation or send draft results
- Manual access for testing or development via the root index page

## Routes

### `GET /`
- Serves a basic HTML page (`index.html`) that introduces the API.
- Originally used when the Flask API was run independently.
- **Note:** This route is not currently exposed externally and is not used by the draft app.
- Retained for potential future use (e.g., manual access, testing, or health checks).

---

### `GET /<player_count>/<identifier>/<commander_packs_included>/<normal_rounds>/<multi_ratio>/<generic_ratio>/<colorless_ratio>/<land_ratio>`

- Main endpoint for setting up a new draft
- Triggers the creation of randomized packs based on the provided configuration
- Returns the full draft configuration as a JSON object if successful
- Returns an error message with HTTP 400 if the configuration is invalid

**Parameters:**
- `player_count` — Number of players
- `identifier` — Unique string used to generate a named file for the draft
- `commander_packs_included` — 1 or 0
- `normal_rounds` — Number of draft rounds (default: 8)
- `multi_ratio`, `generic_ratio`, `colorless_ratio`, `land_ratio` — Define the composition of the uncut pack used in structured pack generation

**Notes:**
- Parameters are passed as URL path variables (not query params)
- The `uncut_pack_size` is calculated as:  
  `multi_ratio + 5 * generic_ratio + colorless_ratio + land_ratio`
- The number of structured packs is automatically calculated to ensure full coverage

---

### `POST /draftdata`
- Receives the results of a completed draft in JSON format
- Passes the data to the `send_draft_data` function, which inserts it into the database
- Planned improvements:
  - The current response is a simple "success" string.
  - In the future, this will be expanded to return more detailed information such as:
    - Number of records inserted
    - Validation results (e.g., missing or malformed data)
    - Error handling for edge cases (e.g., duplicate entries, DB write failures)

---

## Internals
- Uses `Flask-RESTful` to define the JSON-returning route
- Draft setup logic is handled in `src.operations.setup_server.setup`
- Input validation is handled via `api_parameter_errors`, which ensures identifiers are valid and player counts are within range
- Draft JSONs are stored in `templates/` as `draft<identifier>.json` and loaded when requested

## Notes
- Currently deployed as part of a three-container Azure Container Instance
- Can be slow to respond after inactivity due to free-tier container cold starts
- The API is designed for internal use by the draft app backend and is not publicly documented or authenticated

