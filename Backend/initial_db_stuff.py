import psycopg2
import os
from dotenv import load_dotenv
import card_json_fetcher
from Backend.read_txt import read_txt_file

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




# print("Created Commanders table.")
cur.execute("""begin;""")
	
for card_name in read_txt_file("Database_Handling/initial_commander_list.txt"):
	print("Inserting", card_name)
	cur.execute("""
		INSERT INTO Commanders (
			card_id)
		VALUES (
			(SELECT id FROM Cards WHERE name = %s));
	""", (card_name,))
	
conn.commit()