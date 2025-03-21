
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