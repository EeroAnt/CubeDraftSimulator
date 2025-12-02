from operations.card_json_fetcher import fetch_card_json
from operations.read_txt import read_txt_file
from time import sleep

def search_cards(cursor, query, choice):
	choices = {
		1 : "name",
		2 : "types",
		3 : "oracle_text"
	}
	cursor.execute(f"SELECT id, name, draft_pool, case when cards.id=card_id then 'yes' else 'no' end as commander, active FROM cards LEFT JOIN commanders on cards.id=card_id WHERE {choices[choice]} LIKE %s", (query,))
	cards = cursor.fetchall()
	if len(cards) == 0:
		print("No cards found.")
	elif len(cards) > 100:
		print(f"Too many cards found ({len(cards)}). Please refine your search.")
	else:
		print("{:<6} {:<40} {:<10} {:<9} {:<6}".format("id", "name", "draft pool", "commander", "active"))
		for card in cards:
			print("{:<6} {:<40} {:<10} {:<9} {:<6}".format(card[0], card[1][:40], card[2], card[3], card[4]))
		return cards

def update_draft_pool(cursor, card_id):
	cursor.execute("SELECT name, draft_pool FROM Cards WHERE id = %s;", (card_id,))
	card = cursor.fetchone()
	if card != None:
		draft_pool = input(f"Enter the new draft pool for {card[0]} ({card[1]}) (0 to cancel): ")
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
    cursor.execute("SELECT active FROM Cards WHERE name = %s;", (cardname,))
    card = cursor.fetchone()
    
    if card is None:
        return True  # Card not present at all
    elif not card[0]:
        return "inactive"  # Card exists but is inactive
    else:
        return False  # Card exists and is active

def add_card(cursor, cardname):
	card = fetch_card_json(cardname)
	if card == None:
		print(f"{cardname} not found.")
		return
	card_status = check_card(cursor, cardname)
	if not card_status:
		print(f"{cardname} is already active in the database.")
		return
	elif card_status == "inactive":
		print(f"{cardname} has been removed from the cube earlier")
		add_anyway = input("Would you like to add it back? (y/n)")
		if add_anyway == "y":
			print(f"Reactivating {card['name']}")
			cursor.execute("BEGIN;")
			cursor.execute("""
					UPDATE cards
					SET active = true
					WHERE name = %s;
									""", (card["name"]))
			cursor.execute("COMMIT;")
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
			cursor.execute("BEGIN;")
			cursor.execute("UPDATE cards SET active = false WHERE id = %s;", (card_id,))
			cursor.execute("COMMIT;")
			print(f"{card[1]} has been deleted.")
	else:
		print("Card not found.")
	return

def remove_multiple_cards(cursor):
	cards = read_txt_file("delete.txt")
	for card in cards:
		print(card)
		cursor.execute("SELECT * FROM Cards WHERE name LIKE %s;", ('%'+card+'%',))
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
		cursor.execute("SELECT * FROM Cards WHERE name LIKE %s;", ('%'+card+'%',))
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

def print_cube_contents(cursor):
	cursor.execute("SELECT name, cards.id FROM Commanders LEFT JOIN Cards ON Commanders.card_id = Cards.id ORDER BY name;")
	commanders = cursor.fetchall()
	with open("cube.txt", "w") as file:
		for commander in commanders:
			file.write("{:<3} {}".format("",commander[0])+ "\n")
	
	commander_ids = [commander[1] for commander in commanders]

	cursor.execute("SELECT name, draft_pool FROM Cards WHERE id not in %s AND active = true  draft_pool, name;", (tuple(commander_ids),))
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
	cursor.execute("SELECT count(*), draft_pool FROM cards WHERE active = true GROUP BY draft_pool ORDER BY count(*) desc;")
	draft_pools = cursor.fetchall()
	print("Pool sizes:")
	for pool in draft_pools:
		print("{:<5} {}".format(pool[0], pools[pool[1]]))

	cursor.execute("SELECT count(*), color_identity FROM cards WHERE draft_pool LIKE 'M' AND active = true GROUP BY color_identity ORDER BY count(*) desc;")
	multi_ratios = cursor.fetchall()
	print("\n")
	print("Color distribution in multicolor cards:")
	for ratio in multi_ratios:
		print("{:<5} {}".format(ratio[0], ratio[1]))

	cursor.execute("SELECT count(*) FROM commanders;")
	commanders = cursor.fetchone()
	print("\n")
	print(f"Amount of commanders: {commanders[0]}")
	cursor.execute("SELECT count(*), color_identity FROM commanders LEFT JOIN cards ON commanders.card_id = cards.id GROUP BY color_identity ORDER BY count(*) desc;")
	commander_ratios = cursor.fetchall()
	print("\n")
	print("Color distribution in commander pool:")
	for ratio in commander_ratios:
		print("{:<5} {}".format(ratio[0], ratio[1]))
		
def print_draft_contents(cursor, draft_id):
    # Get commanders from this draft
    cursor.execute("""
        SELECT c.name, d.username
        FROM Drafts d
        JOIN Commanders cm ON d.card_id = cm.card_id
        JOIN Cards c ON cm.card_id = c.id
        WHERE d.draft_id = %s
        ORDER BY c.name;
    """, (draft_id,))
    commanders = cursor.fetchall()

    with open(f"draft_{draft_id}.txt", "w") as file:
        for name, username in commanders:
            file.write(f"    {name:<35} {username}\n")

    # Get non-commander cards from this draft
    cursor.execute("""
        SELECT c.name, c.draft_pool, d.username
        FROM Drafts d
        JOIN Cards c ON d.card_id = c.id
        WHERE d.draft_id = %s AND d.card_id NOT IN (
            SELECT card_id FROM Commanders
        )
        ORDER BY c.draft_pool, c.name;
    """, (draft_id,))
    cards = cursor.fetchall()

    with open(f"draft_{draft_id}.txt", "a") as file:
        for name, draft_pool, username in cards:
            file.write(f"{draft_pool:<3} {name:<35} {username}\n")

    return