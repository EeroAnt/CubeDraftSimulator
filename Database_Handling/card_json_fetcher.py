import requests
import read_txt
from time import sleep

def fetch_card_json(card_name):
	"""Fetches card data from Scryfall API and returns it as a JSON object."""
	card_name = card_name.replace(" ", "+")
	url = f"https://api.scryfall.com/cards/named?fuzzy={card_name}"
	scryfall_response = requests.get(url).json()
	# If the card has a backside, we need to fetch the backside data from the API
	handle_card_json(scryfall_response)

def handle_card_json(card_json):
	"""Takes in a JSON object and returns a dictionary with the card's data."""
	card_data = {}
	card_data["name"] = card_json["name"]
	card_data["mana_value"] = int(card_json["cmc"])
	card_data["color_identity"] = "".join(card_json["color_identity"])
	card_data["types"] = "".join(card_json["type_line"])
	if "card_faces" in card_json:
		card_data["oracle_text"] = card_json["card_faces"][0]["oracle_text"]+" // "+card_json["card_faces"][1]["oracle_text"] 
		if card_json["layout"] == "split":
			card_data["image_url"] = card_json["image_uris"]["normal"]
		else:
			card_data["image_url"] = card_json["card_faces"][0]["image_uris"]["normal"]
			card_data["backside_url"] = card_json["card_faces"][1]["image_uris"]["normal"]
	else:
		card_data["oracle_text"] = card_json["oracle_text"] if "oracle_text" in card_json else ""
		card_data["image_url"] = card_json["image_uris"]["normal"]
	print(card_data["name"])
	card_data["draft_pool"] = card_data["color_identity"] if len(card_data["color_identity"]) == 1 else input("Enter the card's draft pool: ")


if __name__ == "__main__":
	card_names = read_txt.read_txt_file("Database_Handling/initial_card_list.txt")
	for card_name in card_names[1200:]:
		fetch_card_json(card_name)
		sleep(0.12)