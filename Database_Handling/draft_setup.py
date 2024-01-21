import psycopg2
import os
from dotenv import load_dotenv
from Database_Handling.queries import *
from math import ceil
from Database_Handling.pool_generation import *

load_dotenv()

# Connect to the database
conn = psycopg2.connect(
	host=os.getenv("DB_HOST"),
	database=os.getenv("DB_NAME"),
	user=os.getenv("DB_USER"),
	password=os.getenv("DB_PASSWORD")
)

cur = conn.cursor()

def generate_pools(player_count):
	pools = {}
	number_of_structured_packs = ceil(15*8*player_count/18)

	pools["commanders"], commander_ids = generate_commander_pool(
		player_count, 
		cur)
	
	sql_for_multicolored_pool = multicolored_pool_query(commander_ids)
	pools["multicolored_pool"] = generate_multicolored_pool(
		sql_for_multicolored_pool,
		pool_size=number_of_structured_packs*3, 
		cur=cur)
	
	for i in ["white", "blue", "black", "red", "green", "land"]:
		pools[i] = generate_generic_pool(
			i[0].upper(), 
			pool_size=number_of_structured_packs*2, 
			cur=cur)

	pools["colorless"] = generate_generic_pool(
		"C", 
		pool_size=number_of_structured_packs*3, 
		cur=cur)
	
	return pools
