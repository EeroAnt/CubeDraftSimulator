from operations.card_json_fetcher import fetch_card_json
from operations.read_txt import read_txt_file

def search_cards(cursor, query):
	# Search for cards in the database
	cursor.execute("SELECT * FROM cards WHERE name LIKE %s", (query,))
	cards = cursor.fetchall()
	if len(cards) == 0:
		print("No cards found.")
	if len(cards) > 10:
		print("Too many cards found. Please refine your search.")
	else:
		for card in cards:
			print(card[0], card[1])
		return cards

def add_card(cursor, card):
	card = fetch_card_json(card)
	print(card)
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
	cards = read_txt_file("cards.txt")
	for card in cards:
		add_card(cursor, card)
	return

def remove_card(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		confirmation = input(f"Are you sure you want to delete {card[1]}? (y/n)")
		if confirmation == "y":
			cursor.execute("BEGIN;")
			cursor.execute("DELETE FROM Cards WHERE id = %s;", (card_id,))
			cursor.execute("COMMIT;")
			print(f"{card[1]} has been deleted.")
	else:
		print("Card not found.")
	return

def add_commander(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		cursor.execute("BEGIN;")
		cursor.execute("INSERT INTO Commanders(card_id) VALUES (%s);", (card_id,))
		cursor.execute("COMMIT;")
		print(f"{card[1]} has been added as a commander.")
	else:
		print("Card not found.")
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