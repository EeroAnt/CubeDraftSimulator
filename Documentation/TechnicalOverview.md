# MTG Draft Application - Technical Documentation

## System Overview

```mermaid
graph TD

    subgraph GitHub Pages
        DraftData(data.json)
    end

    subgraph Azure WebApp
        CubeStats[CubeStats]
        CubeStats -- read --> DraftData
    end

    subgraph Local Machine
        DB((PostgreSQL Database))
        DCS[(Database Content Service)]
        CubeStatsData[(CubeStatsData ETL)]
        DCS -- Local Connection --> DB
        CubeStatsData -- Local Read --> DB
        CubeStatsData -- export --> DraftData
    end

    subgraph Azure Container Instance
        React[React Frontend]
        Node[(Node.js Backend)]
        FlaskAPI[(Flask API)]
        
        React <-- WebSocket --> Node
        Node -- HTTP --> FlaskAPI
        FlaskAPI -- SSH Tunnel --> DB
    end

 ```

## Development context

This project serves as my first larger-scale independent build, and the architecture reflects a balance between exploring new technologies and leveraging tools I’m already comfortable with. Rather than optimizing for large-scale efficiency, decisions were made with learning and practicality in mind. For example, the system initially ran entirely in the Azure cloud for better performance, but was migrated to a local PostgreSQL setup due to post-trial costs. While SSH tunneling introduces some latency, it’s currently the only notable bottleneck. Given the low likelihood of wider use, suboptimal but stable solutions are perfectly acceptable — at least for now.

| Component | Description | 
|----------|----------|
| [PostgreSQL Database](./PostgreSQL.md)  | 	Local PostgreSQL storing all data  |
| [Database Content Service](./DCS.md)  | For maintaining contents of the cube  |
| [CubeStatsData ETL](./CubeStatsETL.md) | Builds JSON stats from local DB |
| [CubeStats WebApp](./CubeStatsWebApp.md) | Loads JSON stats from GitHub Pages |
| [Flask API](./FlaskAPI.md) |	DB middleware (via SSH) |
| Node.js Backend | Backend logic + WebSocket manager for Draft App |
| React Frontend | Draft UI |
