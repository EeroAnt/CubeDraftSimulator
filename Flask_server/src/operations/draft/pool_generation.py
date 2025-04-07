from src.operations.database.sql_to_dict import sql_to_dict
from src.operations.database.queries.setup_queries import commander_pool_query, multicolored_pool_query, generic_pool_query
from src.operations.database.db import connect_to_db


def generate_pools(specs):

	cur, conn = connect_to_db()
	pools = {}
	commander_ids = []

	if specs["commander_packs"]:
		pools["commanders"], commander_ids = generate_commander_pool(
			specs["player_count"],
			cur=cur
			)
		
	sql_for_multicolored_pool = multicolored_pool_query(commander_ids)
	
	pools["multicolored"] = generate_multicolored_pool(
		sql_for_multicolored_pool,
		pool_size=specs["number_of_structured_packs"]*specs["multi_ratio"],
		cur=cur
		)
	
	pool_attributes = [
		("white","W",specs["generic_ratio"]),
		("blue","U",specs["generic_ratio"]),
		("black","B",specs["generic_ratio"]),
		("red","R",specs["generic_ratio"]),
		("green","G",specs["generic_ratio"]),
		("land","L",specs["land_ratio"]),
		("colorless","C",specs["colorless_ratio"])
	]

	for i in pool_attributes:
		pools[i[0]] = generate_generic_pool(
			i[1], 
			pool_size=specs["number_of_structured_packs"]*i[2],
			cur=cur
			)

	return pools, conn

def generate_commander_pool(player_count, cur):
	commanders = []
	commander_ids = []
	cur.execute(commander_pool_query(),(player_count*5,))
	for commander in cur.fetchall():
		commander = sql_to_dict(commander)
		commander_ids.append(str(commander["id"]))
		commanders.append(commander)
	return commanders, commander_ids

def generate_multicolored_pool(sql_for_multicolored_pool, pool_size, cur):
	cards = []
	cur.execute(sql_for_multicolored_pool, (pool_size,))
	for card in cur.fetchall():
		card = sql_to_dict(card)
		cards.append(card)
	return cards

def generate_generic_pool(pool, pool_size, cur):
	cards = []
	cur.execute(generic_pool_query(pool), (pool_size,))
	for card in cur.fetchall():
		card = sql_to_dict(card)
		cards.append(card)
	return cards