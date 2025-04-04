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
    pick INTEGER
);

INSERT INTO temp_picked_cards (card_id, pick)
SELECT 
    UNNEST(ARRAY[pick1, pick2, pick3, pick4, pick5, pick6, pick7, pick8, pick9, pick10, 
                 pick11, pick12, pick13, pick14, pick15]) AS card_id,
    UNNEST(ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS pick
FROM picked_packs;
"""
  return sql

def get_commander_picks_query():
  sql = """
CREATE TEMP TABLE temp_picked_commanders (
    card_id INTEGER,
    pick INTEGER
);

INSERT INTO temp_picked_commanders (card_id, pick)
SELECT 
    UNNEST(ARRAY[pick1, pick2, pick3, pick4, pick5]) AS card_id,
    UNNEST(ARRAY[1,2,3,4,5]) AS pick
FROM picked_commander_packs;
"""
  return sql

def get_pick_rates_query():
  sql = """
SELECT
    card_id,
		AVG(pick)
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
		AVG(pick)
FROM
    temp_picked_commanders
GROUP BY
    card_id;
"""
  return sql
# From here on, the queries are using outdated schema and are not used anymore.
def draft_pool_ratings_query():
	sql = """
	select
	  avg(pick_number)::numeric(10,2),
	  draft_pool
	from
	  picks
	left join
	  cards
	on
	  card_id=cards.id
	group by
	  draft_pool;"""
	return sql

def bottom_cards_query(pool, amount):
	sql = f"""
	select
	  name,
	  image_url,
	  backside_image_url,
	  avg(pick_number)::numeric(10,2) as avg_pick,
	  count(*) as amount_of_picks
	from
	  picks
	left join
	  cards
	on
	  card_id=cards.id
	where 
	  draft_pool like '{pool}'
	group by
	  name,
	  image_url,
	  backside_image_url
	HAVING
	  avg(pick_number) IS NOT NULL
	order by
	  avg_pick desc
	limit
	  {amount};"""
	return sql

def bottom_cards_from_multi_query(color_identity, amount):
	sql = f"""
	select
	  name,
	  image_url,
	  backside_image_url,
	  avg(pick_number)::numeric(10,2) as avg_pick,
	  count(*) as amount_of_picks
	from
	  picks
	left join
	  cards
	on
	  card_id=cards.id
	where 
	  color_identity like '{color_identity}'
	  and
	  draft_pool like 'M'
	group by
	  name,
	  image_url,
	  backside_image_url
	HAVING
	  avg(pick_number) IS NOT NULL
	order by
	  avg_pick desc
	limit
	  {amount};"""
	return sql

def multipool_distribution_query():
	sql = """
	select
	  count(*) as amount,
	  color_identity
	from
	  cards
	where
	  draft_pool like 'M'
	group by
	  color_identity
	order by
	  amount desc;"""
	return sql

def commander_color_distribution_query():
	sql = """
	select
	  count(*) as amount,
	  color_identity
	from
	  commanders
	left join
	  cards
	on
	  cards.id=card_id
	where
	  draft_pool like 'M'
	group by
	  color_identity
	order by
	  amount desc;"""
	return sql

def commanders_query():
	sql = """
	select
	  name,
	  color_identity,
	  image_url,
	  backside_image_url
	from
	  commanders
	left join
	  cards
	on
	  cards.id=card_id;"""
	return sql