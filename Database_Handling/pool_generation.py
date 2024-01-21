from Database_Handling.sql_to_dict import sql_to_dict
from Database_Handling.queries import *
from Database_Handling.cloud_db import connect_to_cloud_db
from math import ceil


def generate_pools(player_count):
	cur, conn = connect_to_cloud_db()
	pools = {}
	number_of_structured_packs = ceil(15*8*player_count/18)

	pools["commanders"], commander_ids = generate_commander_pool(
		player_count,
		cur=cur
		)
	
	sql_for_multicolored_pool = multicolored_pool_query(commander_ids)
	
	pools["multicolored_pool"] = generate_multicolored_pool(
		sql_for_multicolored_pool,
		pool_size=number_of_structured_packs*3,
		cur=cur
		)
	
	for i in ["white", "blue", "black", "red", "green", "land"]:
		pools[i] = generate_generic_pool(
			i[0].upper(), 
			pool_size=number_of_structured_packs*2,
			cur=cur
			)

	pools["colorless"] = generate_generic_pool(
		"C", 
		pool_size=number_of_structured_packs*3,
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