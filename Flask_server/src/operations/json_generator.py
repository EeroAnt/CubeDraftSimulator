import json

def generate_json(setup, identifier="test"):

	with open(f"src/data/draft{identifier}.json", "w") as f:
		json.dump(setup, f)
