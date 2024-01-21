import json

def generate_json(commander_packs, normal_packs):

	with open("Simulator/draft.json", "w") as f:
		json.dump({"commander_packs": commander_packs, "normal_packs": normal_packs}, f)