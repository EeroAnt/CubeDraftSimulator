import psycopg2
from os import getenv
from dotenv import load_dotenv
from Database_Handling.sql_to_dict import sql_to_dict
from Database_Handling.queries import *
from math import ceil

load_dotenv()

# Connect to the database
conn = psycopg2.connect(
	host=getenv("DB_HOST"),
	database=getenv("DB_NAME"),
	user=getenv("DB_USER"),
	password=getenv("DB_PASSWORD")
)

cur = conn.cursor()

def generate_pools(player_count):
	pools = {}
	number_of_structured_packs = ceil(15*8*player_count/18)

	pools["commanders"], commander_ids = generate_commander_pool(
		player_count
		)
	
	sql_for_multicolored_pool = multicolored_pool_query(commander_ids)
	pools["multicolored_pool"] = generate_multicolored_pool(
		sql_for_multicolored_pool,
		pool_size=number_of_structured_packs*3
		)
	
	for i in ["white", "blue", "black", "red", "green", "land"]:
		pools[i] = generate_generic_pool(
			i[0].upper(), 
			pool_size=number_of_structured_packs*2 
			)

	pools["colorless"] = generate_generic_pool(
		"C", 
		pool_size=number_of_structured_packs*3
		)
	
	return pools

def generate_commander_pool(player_count):
	commanders = []
	commander_ids = []
	cur.execute(get_commanders_query(),(player_count*5,))
	for commander in cur.fetchall():
		commander = sql_to_dict(commander)
		commander_ids.append(str(commander["id"]))
		commanders.append(commander)
	return commanders, commander_ids

def generate_multicolored_pool(sql_for_multicolored_pool, pool_size):
	cards = []
	cur.execute(sql_for_multicolored_pool, (pool_size,))
	for card in cur.fetchall():
		card = sql_to_dict(card)
		cards.append(card)
	return cards

def generate_generic_pool(pool, pool_size):
	cards = []
	cur.execute(generic_pool_query(pool), (pool_size,))
	for card in cur.fetchall():
		card = sql_to_dict(card)
		cards.append(card)
	return cards