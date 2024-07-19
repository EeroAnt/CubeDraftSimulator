from operations.card_json_fetcher import fetch_card_json
from operations.read_txt import read_txt_file
from time import sleep

def search_cards(cursor, query):
	cursor.execute("SELECT id, name, draft_pool FROM cards WHERE name LIKE %s", (query,))
	cards = cursor.fetchall()
	if len(cards) == 0:
		print("No cards found.")
	if len(cards) > 10:
		print("Too many cards found. Please refine your search.")
	else:
		for card in cards:
			print("{:<6} {:<30} {}".format(card[0], card[1], card[2]))
		return cards

def update_draft_pool(cursor, card_id, draft_pool):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		cursor.execute("BEGIN;")
		cursor.execute("UPDATE Cards SET draft_pool = %s WHERE id = %s;", (draft_pool, card_id))
		cursor.execute("COMMIT;")
		print(f"{card[1]} has been updated.")
	else:
		print("Card not found.")
	return

def check_card(cursor, cardname):
	cursor.execute("SELECT * FROM Cards WHERE name = %s;", (cardname,))
	card = cursor.fetchone()
	if card != None:
		return True
	else:
		return False

def add_card(cursor, cardname):
	card = fetch_card_json(cardname)
	if card == None:
		print(f"{cardname} not found.")
		return
	if check_card(cursor, cardname):
		print(f"{cardname} is already in the database.")
		return
	cursor.execute("BEGIN;")
	cursor.execute("""INSERT INTO
				Cards(
					name,
					mv,
					color_identity,
					types,
					oracle_text,
					image_url,
					backside_image_url,
					draft_pool
				)
				VALUES
					(%s, %s, %s, %s, %s, %s, %s, %s);""",
				(
					card["name"],
					card["mana_value"],
					card["color_identity"],
					card["types"],
					card["oracle_text"],
					card["image_url"],
					card["backside_image_url"],
					card["draft_pool"]
				)
	)
	cursor.execute("COMMIT;")

def add_multiple_cards(cursor):
	cards = read_txt_file("commanders.txt")
	for card in cards:
		sleep(0.12)
		add_card(cursor, card)
	return

def remove_card(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		confirmation = input(f"Are you sure you want to delete {card[1]}? (y/n)")
		if confirmation == "y":
			remove_commander(cursor, card_id)
			remove_from_picks(cursor, card_id)
			cursor.execute("BEGIN;")
			cursor.execute("DELETE FROM Cards WHERE id = %s;", (card_id,))
			cursor.execute("COMMIT;")
			print(f"{card[1]} has been deleted.")
	else:
		print("Card not found.")
	return

def remove_multiple_cards(cursor):
	cards = read_txt_file("delete.txt")
	for card in cards:
		print(card)
		cursor.execute("SELECT * FROM Cards WHERE name like %s;", ('%'+card+'%',))
		thingy = cursor.fetchall()
		if len(thingy) == 1:
			print(thingy[0][0])
			card_id = thingy[0][0]
			remove_card(cursor, card_id)
		else:
			print('hep')
			print(f"{card} not found.")

def add_commander(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		try:
			cursor.execute("BEGIN;")
			cursor.execute("INSERT INTO Commanders(card_id) VALUES (%s);", (card_id,))
			cursor.execute("COMMIT;")
			print(f"{card[1]} has been added as a commander.")
		except:
			print(f"{card[1]} is already a commander.")
	else:
		print("Card not found.")
	return

def add_multiple_commanders(cursor):
	cards = read_txt_file("commanders.txt")
	for card in cards:
		print(card)
		cursor.execute("ROLLBACK;")
		cursor.execute("SELECT * FROM Cards WHERE name like %s;", ('%'+card+'%',))
		thingy = cursor.fetchall()
		if len(thingy) == 1:
			card_id = thingy[0][0]
			add_commander(cursor, card_id)
		else:
			print(f"{card} not found.")
	return

def remove_commander(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		cursor.execute("SELECT * FROM Commanders WHERE card_id = %s;", (card_id,))
		commander = cursor.fetchone()
		if commander == None:
			print("Card is not a commander.")
			return
		cursor.execute("BEGIN;")
		cursor.execute("DELETE FROM Commanders WHERE card_id = %s;", (card_id,))
		cursor.execute("COMMIT;")
		print(f"{card[1]} has been removed as a commander.")
	else:
		print("Card not found.")
	return

def remove_from_picks(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		cursor.execute("BEGIN;")
		cursor.execute("DELETE FROM Picks WHERE card_id = %s;", (card_id,))
		cursor.execute("COMMIT;")
		print(f"{card[1]} has been removed from the picks.")
	else:
		print("Card not found.")
	return

def print_cube_contents(cursor):
	cursor.execute("SELECT name FROM Cards;")
	cards = cursor.fetchall()
	with open("cube.txt", "w") as file:
		for card in cards:
			file.write(card[0] + "\n")

	cursor.execute("SELECT name FROM Commanders left join Cards on Commanders.card_id = Cards.id;")
	commanders = cursor.fetchall()
	with open("commanders.txt", "w") as file:
		for commander in commanders:
			file.write(commander[0] + "\n")
	return