import requests
from time import sleep
from webbrowser import open

def fetch_card_json(card_name):
	"""Fetches card data from Scryfall API and returns it as a JSON object."""
	card_name = card_name.replace(" ", "+")
	url = f"https://api.scryfall.com/cards/named?fuzzy={card_name}"
	scryfall_response = requests.get(url).json()
	if "object" in scryfall_response and scryfall_response["object"] == "error":
		print(f"Error: {scryfall_response['details']}")
		return None
	card_dict = handle_card_json(scryfall_response)
	return card_dict

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
			card_data["backside_image_url"] = ""
		else:
			card_data["image_url"] = card_json["card_faces"][0]["image_uris"]["normal"]
			card_data["backside_image_url"] = card_json["card_faces"][1]["image_uris"]["normal"]
	else:
		card_data["oracle_text"] = card_json["oracle_text"] if "oracle_text" in card_json else ""
		card_data["image_url"] = card_json["image_uris"]["normal"]
		card_data["backside_image_url"] = ""
	if "Land" in card_data["types"]:
		if not card_data["color_identity"] or len(card_data["color_identity"]) > 1:
			open(card_data["image_url"])
			card_data["draft_pool"] = input("Enter the card's draft pool: ")
		else:
			card_data["draft_pool"] = card_data["color_identity"]
	elif not card_data["color_identity"]:
		card_data["color_identity"] = "C"
		card_data["draft_pool"] = "C"
	elif len(card_data["color_identity"]) > 1 and "Add" in card_data["oracle_text"]:
		open(card_data["image_url"])
		card_data["draft_pool"] = input("Enter the card's draft pool: ")
	else:
		card_data["draft_pool"] = card_data["color_identity"]
	return card_data


if __name__ == "__main__":
	card_names = ["Aethertide Whale", "Aapo", "Aetherwind Basker"]
	for card_name in card_names:
		print(fetch_card_json(card_name))
		sleep(0.12)