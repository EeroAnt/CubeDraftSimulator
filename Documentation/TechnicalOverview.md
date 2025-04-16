# MTG Draft Application - Technical Documentation

## System Overview

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

| Component | Description | 
|----------|----------|
| [PostgreSQL Database](./PostgreSQL.md)  | 	Local PostgreSQL storing all data  |
| [Database Content Service](./DCS.md)  | For maintaining contents of the cube  |
| CubeStatsData ETL | Builds JSON stats from local DB |
| CubeStats Web App | Loads JSON stats from GitHub Pages |
| Flask API |	DB middleware (via SSH) |
| Node.js Backend | Backend logic + WebSocket manager for Draft App |
| React Frontend | Draft UI |
