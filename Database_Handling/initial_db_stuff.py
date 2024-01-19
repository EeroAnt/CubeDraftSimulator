import psycopg2
import os
from dotenv import load_dotenv
import card_json_fetcher
import read_txt

load_dotenv()

# Connect to the database
conn = psycopg2.connect(
	host=os.getenv("DB_HOST"),
	database=os.getenv("DB_NAME"),
	user=os.getenv("DB_USER"),
	password=os.getenv("DB_PASSWORD")
)

# Open a cursor to perform database operations
cur = conn.cursor()

# Create table - cards
cur.execute("""
	CREATE TABLE cards (
		id serial PRIMARY KEY,
		name varchar(255) NOT NULL,
		mana_value integer NOT NULL,
		color_identity text NOT NULL,
		types text NOT NULL,
		oracle_text text,
		image_url varchar(255) NOT NULL,
		backside_image_url varchar(255),
		draft_pool text NOT NULL
	);
""")

for card_name in read_txt.read_txt_file("Database_Handling/initial_card_list.txt"):
	card_data = card_json_fetcher.fetch_card_json(card_name)
	cur.execute("""
		INSERT INTO cards (
			 name,
			 mana_value, 
			 color_identity, 
			 types, 
			 oracle_text, 
			 image_url, 
			 backside_image_url, 
			 draft_pool)
		VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
	""", (
		card_data["name"], 
		card_data["mana_value"], 
		card_data["color_identity"], 
		card_data["types"], 
		card_data["oracle_text"], 
		card_data["image_url"], 
		card_data["backside_image_url"], 
		card_data["draft_pool"]))