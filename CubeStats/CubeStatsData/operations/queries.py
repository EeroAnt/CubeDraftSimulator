def random_test_cards_query(amount):
  sql = f"""
SELECT
	  *
FROM
	  cards
ORDER BY
	  random()
LIMIT %s;""" % amount
  return sql

def get_commander_ids_query():
  sql = """
SELECT
    card_id
FROM
    commanders;"""
  return sql

def get_picks_query():
  sql = """
CREATE TEMP TABLE temp_picked_cards (
    card_id INTEGER,
    pick INTEGER,
    draft_pool TEXT,
    color_identity TEXT
);

INSERT INTO temp_picked_cards (card_id, pick, draft_pool, color_identity)
WITH expanded_picks AS (
    SELECT 
        id AS pack_id,  -- Keep track of the original row from picked_packs
        UNNEST(ARRAY[pick1, pick2, pick3, pick4, pick5, pick6, pick7, pick8, pick9, pick10, 
                     pick11, pick12, pick13, pick14, pick15]) AS card_id,
        UNNEST(ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS pick
    FROM picked_packs
)
SELECT 
    e.card_id,
    e.pick,
    c.draft_pool,
    c.color_identity
FROM expanded_picks e
LEFT JOIN cards c ON e.card_id = c.id
WHERE c.id IS NOT NULL;
"""
  return sql

def get_commander_picks_query():
  sql = """
CREATE TEMP TABLE temp_picked_commanders (
    card_id INTEGER,
    pick INTEGER,
    color_identity TEXT
);

INSERT INTO temp_picked_commanders (card_id, pick, color_identity)
WITH expanded_picks AS (
    SELECT 
        id AS pack_id,  -- Keep track of the original row from picked_commander_packs
        UNNEST(ARRAY[pick1, pick2, pick3, pick4, pick5]) AS card_id,
        UNNEST(ARRAY[1,2,3,4,5]) AS pick
    FROM picked_commander_packs
)
SELECT 
    e.card_id,
    e.pick,
    c.color_identity
FROM expanded_picks e
LEFT JOIN cards c ON e.card_id = c.id
WHERE c.id IS NOT NULL;
"""
  return sql

def get_pick_rates_query():
  sql = """
SELECT
    card_id,
		AVG(pick) as avg_pick,
    COUNT(*) as amount_of_picks
FROM
    temp_picked_cards
GROUP BY
    card_id;
"""
  return sql

def get_commander_pick_rates_query():
  sql = """
SELECT
    card_id,
		AVG(pick) as avg_pick,
    COUNT(*) as amount_of_picks
FROM
    temp_picked_commanders
GROUP BY
    card_id;
"""
  return sql

def get_average_picks_by_color_identity_query():
  sql = """
SELECT
    color_identity,
    AVG(pick) AS avg_pick
FROM
    temp_picked_cards
GROUP BY
    color_identity;
"""
  return sql

def get_average_picks_by_draft_pool_query():
  sql = """
SELECT
    draft_pool,
    AVG(pick) AS avg_pick
FROM
    temp_picked_cards
GROUP BY
    draft_pool;
"""
  return sql

def get_color_distribution_of_multi_query():
  sql = """
SELECT
    color_identity,
    COUNT(*) AS amount_of_cards
FROM
    cards
WHERE
    draft_pool = 'M'
GROUP BY
    color_identity;
"""
  return sql

def get_color_distribution_of_commander_query():
  sql = """
SELECT
    c.color_identity,
    COUNT(*) AS amount_of_cards
FROM
    commanders co
LEFT JOIN cards c ON c.id = co.card_id    
WHERE
    c.id IS NOT NULL
GROUP BY
    color_identity;
"""
  return sql
