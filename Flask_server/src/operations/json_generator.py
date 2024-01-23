import json

def generate_json(setup, identifier="test"):

	with open(f"Flask_server/src/data/draft{identifier}.json", "w") as f:
		json.dump(setup, f)
