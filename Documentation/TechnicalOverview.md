## The idea:

![](https://github.com/EeroAnt/CubeDraftSimulator/blob/main/Documentation/Architecture.PNG)

Mermaid schema:
```mermaid
graph TD

    subgraph GitHub Pages
        DraftData[data.json]
    end

    subgraph Azure WebApp
        CubeStats[CubeStats]
        CubeStats -- read --> DraftData
    end

    subgraph Local Machine
        DB[(PostgreSQL Database)]
        DCS[(Database Content Service)]
        CubeStatsData[(CubeStatsData ETL)]
        DCS -- Local Connection --> DB
        CubeStatsData -- Local Read --> DB
        CubeStatsData -- export --> DraftData
    end

    subgraph Azure Container Instance
        React[React Frontend]
        Node[(Node.js Backend)]
        FlaskAPI[Flask API]
        
        React <-- WebSocket --> Node
        Node -- HTTP --> FlaskAPI
        FlaskAPI -- SSH Tunnel --> DB
    end

 ```


### Database Setup and Schema Overview

The database has been migrated to a locally hosted PostgreSQL server. As part of the migration, I simplified the schema and added support for storing the outcomes of actual drafts.

The current schema includes the following tables:
 - cards: The central table containing card data used throughout the application.
 - commanders: Stores commander options by referencing card_ids from the cards table.
 - picked_packs: Each row represents a pack picked during a draft. It includes an id and 15 columns (pick1 to pick15) storing card_ids in the order they were picked.
 - picked_commander_packs: Similar to picked_packs, but for 5-card commander packs (pick1 to pick5).
 - drafts: Records draft outcomes with columns for draft_token, seat_token, card_id, and username. This table is also used to generate sorted card lists for traditional (physical) play.


