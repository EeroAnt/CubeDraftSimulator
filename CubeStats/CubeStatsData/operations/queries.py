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

GET_COMMANDER_IDS_QUERY = """
SELECT
    card_id
FROM
    commanders;"""

GENERATE_PICKS_TABLE = """
DROP TABLE IF EXISTS temp_picked_cards;

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

GENERATE_COMMANDER_PICKS_TABLE = """
DROP TABLE IF EXISTS temp_picked_commanders;

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

GET_CARDS_QUERY = """
SELECT
    *
FROM
    cards;
"""

GET_PICK_RATES_QUERY = """
SELECT
    card_id,
		AVG(pick) as avg_pick,
    COUNT(*) as amount_of_picks
FROM
    temp_picked_cards
GROUP BY
    card_id;
"""

GET_COMMANDER_PICK_RATES_QUERY = """
SELECT
    card_id,
		AVG(pick) as avg_pick,
    COUNT(*) as amount_of_picks
FROM
    temp_picked_commanders
GROUP BY
    card_id;
"""

GET_AVERAGE_PICKS_BY_COLOR_IDENTITY_QUERY = """
SELECT
    color_identity,
    AVG(pick) AS avg_pick
FROM
    temp_picked_cards
GROUP BY
    color_identity;
"""

GET_AVERAGE_PICKS_BY_DRAFT_POOL_QUERY = """
SELECT
    draft_pool,
    AVG(pick) AS avg_pick
FROM
    temp_picked_cards
GROUP BY
    draft_pool;
"""

GET_COLOR_DISTRIBUTION_OF_MULTI_QUERY = """
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

GET_COLOR_DISTRIBUTION_OF_COMMANDERS_QUERY = """
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

GET_COLOR_IDS_OF_COMMANDERS_QUERY = """
SELECT
    color_identity
FROM(
    SELECT
        DISTINCT cards.color_identity
    FROM 
        commanders
    LEFT JOIN
        cards
    ON
        commanders.card_id = cards.id
) AS
    sub
ORDER BY
    length(color_identity);
"""

GET_COLOR_IDS_OF_PICKED_MULTICOLOR_QUERY = """
SELECT
    color_identity
FROM(
    SELECT
        DISTINCT color_identity,
        draft_pool
    FROM temp_picked_cards
) AS sub
WHERE
    draft_pool = 'M'
ORDER BY
    length(color_identity);
"""

GET_COLOR_IDS_OF_SINGLE_COLOR_QUERY = """
SELECT
    DISTINCT color_identity
FROM
    temp_picked_cards
WHERE
    length(color_identity) = 1;
"""

GET_COLOR_IDS_OF_TWO_COLOR_QUERY = """
SELECT
    DISTINCT color_identity
FROM
    temp_picked_cards
WHERE
    length(color_identity) = 2;
"""

GET_COLOR_IDS_OF_THREE_COLOR_QUERY = """
SELECT
    DISTINCT color_identity
FROM
    temp_picked_cards
WHERE
    length(color_identity) = 3;
"""

GET_COLOR_IDS_OF_NOT_PICKED_CARDS_QUERY = """
SELECT
    color_identity
FROM(
    SELECT
        DISTINCT color_identity
    FROM
        cards
    WHERE
        id NOT IN (SELECT DISTINCT card_id FROM temp_picked_cards)
    AND
        id NOT IN (SELECT DISTINCT card_id FROM temp_picked_commanders)
) AS sub
ORDER BY
    length(color_identity);
"""

GET_COLOR_IDS = """
SELECT
    color_identity
FROM(
    SELECT
        DISTINCT color_identity
    FROM
        cards
) AS sub
ORDER BY
    length(color_identity);
"""

def get_types_of_color_id(cursor, color_id, type_part):
    sql = """
    SELECT
        count(*)
    FROM
        cards
    WHERE
        color_identity = %s
    AND
        types LIKE %s;
    """
    cursor.execute(sql, (color_id, f"%{type_part}%"))
    return cursor.fetchone()

def get_total_of_color_id(cursor, color_id):
    sql = """
    SELECT
        count(*)
    FROM
        cards
    WHERE
        color_identity = %s;
    """
    cursor.execute(sql, (color_id,))
    return cursor.fetchone()