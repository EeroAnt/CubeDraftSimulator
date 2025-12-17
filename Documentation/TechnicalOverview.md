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

## Resource Management & CI/CD

### Infrastructure as Code

Infrastructure is managed with Terraform, organized as follows:
```
terraform/
├── apps/
│   ├── simulator/    # ACI container group
│   └── stats/        # Statistics webapp
├── bootstrap/        # AI foundries
└── modules/
    ├── AI/
    ├── DraftApp/
    └── statisticsWebApp/
```

Terraform is run locally and manages:
- Azure Container Instance (container config, resource allocation, networking)
- Azure Web App (stats webapp)
- AI Foundry services (7 regional deployments)

Environment variables and secrets are injected via Terraform from local `.tfvars` files (not committed). AI foundry endpoints and keys are pulled dynamically using data sources.

### CD Pipeline

The draft simulator has a GitHub Actions pipeline (`.github/workflows/deploy-prod.yml`) that triggers on pushes to the `release` branch when changes occur in:
- `Server/`, `Simulator/`, `Flask_server/`
- Dockerfiles, `docker-compose.yml`
- The workflow file itself

The pipeline:
1. Builds Docker images via `docker compose build`
2. Pushes images to Azure Container Registry
3. Restarts the ACI to pull new images

Frontend build args (`VITE_*` variables) are injected at build time from GitHub Secrets. Backend/Flask environment variables are managed by Terraform, not the pipeline.

### Secrets Management

| Component | Secrets Source |
|-----------|----------------|
| Frontend (build time) | GitHub Secrets → Docker build args |
| Backend & Flask (runtime) | Terraform → ACI env vars |
| AI Foundry keys | Terraform data sources (dynamic) |
| ACR credentials | Terraform data sources (dynamic) |

## Components

Details on each component from the system diagram:

| Component | Description | 
|----------|----------|
| [PostgreSQL Database](./PostgreSQL.md)  | 	Local PostgreSQL storing all data  |
| [Database Content Service](./DCS.md)  | For maintaining contents of the cube  |
| [CubeStatsData ETL](./CubeStatsETL.md) | Builds JSON stats from local DB |
| [CubeStats WebApp](./CubeStatsWebApp.md) | Loads JSON stats from GitHub Pages |
| [Flask API](./FlaskAPI.md) |	DB middleware (via SSH) |
| [AI drafter Agents](./AI.md) | LLM-powered NPCs that draft, analyze, and build game plans |
| Node.js Backend | Backend logic + WebSocket manager for Draft App |
| React Frontend | Draft UI |
