import requests
from time import sleep
from webbrowser import open

def fetch_card_json(card_name, predetermined_draft_pool=None):
	"""Fetches card data from Scryfall API and returns it as a JSON object."""
	url = "https://api.scryfall.com/cards/named"
	params = {"fuzzy": card_name}
	headers = {
		"User-Agent": "CubeDraftSimulator/1.0",
		"Accept": "application/json;q=0.9,*/*;q=0.8",
	}
	scryfall_response = requests.get(url, params=params, headers=headers).json()
	if "object" in scryfall_response and scryfall_response["object"] == "error":
		print(f"Error: {scryfall_response['details']}")
		return None
	card_dict = handle_card_json(scryfall_response, predetermined_draft_pool)
	return card_dict

def handle_card_json(card_json, predetermined_draft_pool=None):
	"""Takes in a JSON object and returns a dictionary with the card's data."""
	card_data = {}
	card_data["name"] = card_json["name"]
	card_data["mana_value"] = int(card_json["cmc"])
	card_data["color_identity"] = "".join(card_json["color_identity"]) or "C"
	card_data["types"] = "".join(card_json["type_line"])
	if "card_faces" in card_json:
		faces = card_json["card_faces"]
		card_data["oracle_text"] = faces[0].get("oracle_text", "") + " // " + faces[1].get("oracle_text", "")
		if "image_uris" in faces[0]:
			# Two distinct images: transform, modal_dfc, reversible, etc.
			card_data["image_url"] = faces[0]["image_uris"]["normal"]
			card_data["backside_image_url"] = faces[1]["image_uris"]["normal"]
		else:
			# One shared image: split, flip, adventure, prepare, ...
			card_data["image_url"] = card_json["image_uris"]["normal"]
			card_data["backside_image_url"] = ""
	else:
		card_data["oracle_text"] = card_json.get("oracle_text", "")
		card_data["image_url"] = card_json["image_uris"]["normal"]
		card_data["backside_image_url"] = ""
	if "Land" in card_data["types"]:
		if card_data["color_identity"] == "C" or len(card_data["color_identity"]) > 1:
			if predetermined_draft_pool:
				card_data["draft_pool"] = predetermined_draft_pool
			else:
				open(card_data["image_url"])
				card_data["draft_pool"] = input("Enter the card's draft pool: ")
		else:
			card_data["draft_pool"] = card_data["color_identity"]
	elif not card_data["color_identity"]:
		card_data["color_identity"] = "C"
		card_data["draft_pool"] = "C"
	elif len(card_data["color_identity"]) > 1 and "Add" in card_data["oracle_text"]:
		if predetermined_draft_pool:
			card_data["draft_pool"] = predetermined_draft_pool
		else:
			open(card_data["image_url"])
			card_data["draft_pool"] = input("Enter the card's draft pool: ")
	elif len(card_data["color_identity"]) > 1:
		card_data["draft_pool"] = "M"
	else:
		card_data["draft_pool"] = card_data["color_identity"]
	return card_data


if __name__ == "__main__":
	card_names = ["Aethertide Whale", "Aapo", "Aetherwind Basker"]
	for card_name in card_names:
		print(fetch_card_json(card_name))
		sleep(0.12)