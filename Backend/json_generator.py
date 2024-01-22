import json

def generate_json(player, identifier="test"):

	with open(f"Simulator/draft{identifier}.json", "w") as f:
		json.dump({"player": player}, f)