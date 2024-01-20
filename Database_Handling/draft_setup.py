import psycopg2
import os
from dotenv import load_dotenv
from queries import *
from sql_to_dict import sql_to_dict
from math import ceil

load_dotenv()

# Connect to the database
conn = psycopg2.connect(
	host=os.getenv("DB_HOST"),
	database=os.getenv("DB_NAME"),
	user=os.getenv("DB_USER"),
	password=os.getenv("DB_PASSWORD")
)

cur = conn.cursor()

def draft_setup(player_count):
	number_of_structured_packs = ceil(15*8*player_count/18)
	commanders, commander_ids = generate_commander_pool(player_count)
	sql_for_multicolored_pool = multicolored_pool_query(commander_ids)
	multicolored_pool = generate_multicolored_pool(sql_for_multicolored_pool, number_of_structured_packs)
	

def generate_commander_pool(player_count):
	commanders = []
	commander_ids = []
	cur.execute(get_commanders_query(),(player_count*5,))
	for commander in cur.fetchall():
		commander = sql_to_dict(commander)
		commander_ids.append(str(commander["id"]))
		commanders.append(commander)
	return commanders, commander_ids

def generate_multicolored_pool(sql_for_multicolored_pool, number_of_structured_packs):
	cards = []
	cur.execute(sql_for_multicolored_pool, (number_of_structured_packs*15,))
	for card in cur.fetchall():
		card = sql_to_dict(card)
		cards.append(card)
		print(card["name"])

if __name__ == "__main__":
	draft_setup(4)