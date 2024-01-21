from Database_Handling.sql_to_dict import sql_to_dict
from Database_Handling.read_txt import read_txt_file
from Database_Handling.queries import *

def generate_commander_pool(player_count, cur):
	commanders = []
	commander_ids = []
	cur.execute(get_commanders_query(),(player_count*5,))
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