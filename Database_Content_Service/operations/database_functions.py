from operations.card_json_fetcher import fetch_card_json
from operations.read_txt import read_txt_file
from time import sleep

def search_cards(cursor, query, choice):
	choices = {
		"1" : "name",
		"2" : "types",
		"3" : "oracle_text"
	}
	cursor.execute(f"SELECT id, name, draft_pool, case when cards.id=card_id then 'yes' else 'no' end as commander from cards left join commanders on cards.id=card_id WHERE {choices[choice]} LIKE %s", (query,))
	cards = cursor.fetchall()
	if len(cards) == 0:
		print("No cards found.")
	elif len(cards) > 100:
		print(f"Too many cards found ({len(cards)}). Please refine your search.")
	else:
		print("{:<6} {:<40} {:<10} {}".format("id", "name", "draft pool", "commander"))
		for card in cards:
			print("{:<6} {:<40} {:<10} {}".format(card[0], card[1], card[2], card[3]))
		return cards

def update_draft_pool(cursor, card_id):
	cursor.execute("SELECT * FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		draft_pool = input(f"Enter the new draft pool for {card[1]} (0 to cancel): ")
		if draft_pool == "0":
			print("Operation cancelled.")
			return
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
	cards = read_txt_file("cards.txt")
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
		cursor.execute("ROLLBACK;")
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
	cursor.execute("SELECT name, cards.id FROM Commanders left join Cards on Commanders.card_id = Cards.id order by name;")
	commanders = cursor.fetchall()
	with open("cube.txt", "w") as file:
		for commander in commanders:
			file.write("{:<3} {}".format("",commander[0])+ "\n")
	
	commander_ids = [commander[1] for commander in commanders]

	cursor.execute("SELECT name, draft_pool FROM Cards Where id not in %s order by draft_pool, name;", (tuple(commander_ids),))
	cards = cursor.fetchall()
	with open("cube.txt", "a") as file:
		for card in cards:
			file.write("{:<3} {}".format(card[1],card[0])+ "\n")

	return

def inspect_cube_contents(cursor):
	pools = {
		"M" : "Multicolor",
		"L" : "Lands",
		"C" : "Colorless",
		"U" : "Blue",
		"W" : "White",
		"B" : "Black",
		"R" : "Red",
		"G" : "Green"
	}
	cursor.execute("Select count(*), draft_pool from cards group by draft_pool order by count(*) desc;")
	draft_pools = cursor.fetchall()
	print("Pool sizes:")
	for pool in draft_pools:
		print("{:<5} {}".format(pool[0], pools[pool[1]]))

	cursor.execute("Select count(*), color_identity from cards where draft_pool like 'M' group by color_identity order by count(*) desc;")
	multi_ratios = cursor.fetchall()
	print("\n")
	print("Color distribution in multicolor cards:")
	for ratio in multi_ratios:
		print("{:<5} {}".format(ratio[0], ratio[1]))

	cursor.execute("Select count(*) from commanders;")
	commanders = cursor.fetchone()
	print("\n")
	print(f"Amount of commanders: {commanders[0]}")
	cursor.execute("Select count(*), color_identity from commanders left join cards on commanders.card_id = cards.id group by color_identity order by count(*) desc;")
	commander_ratios = cursor.fetchall()
	print("\n")
	print("Color distribution in commander pool:")
	for ratio in commander_ratios:
		print("{:<5} {}".format(ratio[0], ratio[1]))