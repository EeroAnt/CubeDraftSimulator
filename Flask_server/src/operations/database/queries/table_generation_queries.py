def create_drafts_table_query():
    sql = """
    CREATE TABLE drafts (
        draft_id VARCHAR(4) NOT NULL,
        card_id INT NOT NULL REFERENCES cards(id),
        seat VARCHAR(4) NOT NULL,
        username VARCHAR(16) NOT NULL,
        PRIMARY KEY (draft_id, card_id)
    );
    """
    return sql

def create_picked_packs_table_query():
    sql = """
    CREATE TABLE picked_packs (
        pick1 INT NOT NULL REFERENCES cards(id),
        pick2 INT NOT NULL REFERENCES cards(id),
        pick3 INT NOT NULL REFERENCES cards(id),
        pick4 INT NOT NULL REFERENCES cards(id),
        pick5 INT NOT NULL REFERENCES cards(id),
        pick6 INT NOT NULL REFERENCES cards(id),
        pick7 INT NOT NULL REFERENCES cards(id),
        pick8 INT NOT NULL REFERENCES cards(id),
        pick9 INT NOT NULL REFERENCES cards(id),
        pick10 INT NOT NULL REFERENCES cards(id),
        pick11 INT NOT NULL REFERENCES cards(id),
        pick12 INT NOT NULL REFERENCES cards(id),
        pick13 INT NOT NULL REFERENCES cards(id),
        pick14 INT NOT NULL REFERENCES cards(id),
        pick15 INT NOT NULL REFERENCES cards(id)
    );
    """
    return sql

def create_picked_commander_packs_table_query():
    sql = """
    CREATE TABLE picked_commander_packs (
        pick1 INT NOT NULL REFERENCES cards(id),
        pick2 INT NOT NULL REFERENCES cards(id),
        pick3 INT NOT NULL REFERENCES cards(id),
        pick4 INT NOT NULL REFERENCES cards(id),
        pick5 INT NOT NULL REFERENCES cards(id)
    );
    """
    return sql