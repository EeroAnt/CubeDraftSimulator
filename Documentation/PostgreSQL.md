# PostgreSQL Database

## Purpose:
  Stores all core application data: cards, commanders, picks, draft results

### Accessed by:

 - Flask API via SSH tunnel from the Azure Container Instance
 - Database Content Service for maintaining cube contents
 - CubeStatsData ETL for extracting and transforming data for analytics

### Location:
Hosted locally on a Windows desktop. The database is only accessible when the host machine is powered on.

### Connection:
Local services connect via the PostgreSQL port configured on the host machine. Remote services (e.g., Flask API) connect through an SSH tunnel with port forwarding, managed in a Docker container.

### Schema overview:

 - `cards`: Central reference table. Contains card metadata (name, color identity, type, etc.).
 - `commanders`: Stores commander options by referencing card_ids from the cards table.
 - `picked_packs`: Each row represents a pack picked during a draft. It includes an id and 15 columns (pick1 to pick15) storing card_ids in the order they were picked.
 - `picked_commander_packs`: Similar to picked_packs, but for 5-card commander packs (pick1 to pick5).
 - `drafts`: Records draft outcomes with columns for draft token, seat token, card id, and username. This table is also used to generate sorted card lists for traditional (physical) play.

### Security & Access Control:

 - Default PostgreSQL authentication using local user accounts
 - Plan to add a lower-privilege user for ETL reads
 - Remote access restricted to SSH tunnel only

### Notes:

 - Backups are done periodically via pg_dump and restored using pg_restore
 - ETL processes rely on this schema remaining consistent—any schema changes should be reflected in the ETL logic