from random import shuffle
def create_commander_packs(commander_pool):
	shuffle(commander_pool)
	commander_packs = {}
	amount_of_packs = len(commander_pool) // 5
	for i in range(amount_of_packs):
		pack_name = f"pack{i}"
		commander_packs[pack_name] = {"cards": [], "picks": []}
	for i in range(len(commander_pool)):
		commander_packs[f"pack{i % len(commander_pool)//5}"]["cards"].append(commander_pool[i])
	return commander_packs

def create_normal_packs(pools, specs):
	normal_packs = {}
	for i in range(specs["player_count"]*specs["normal_rounds"]):
		pack_name = f"pack{i}"
		normal_packs[pack_name] = {"cards": [], "picks": []}
	cut_cards = []
	for i in range(len(pools["white"])//specs["generic_ratio"]):
		for j in ['white', 'blue', 'black', 'red', 'green']:
			normal_packs[f"pack{i}"]["cards"] += pools[j][i*specs["generic_ratio"]:i*specs["generic_ratio"]+specs["generic_ratio"]]
		for j in range(specs["land_ratio"]):
			normal_packs[f"pack{i}"]["cards"].append(pools["land"][i*specs["land_ratio"]+j])
		for j in range(specs["colorless_ratio"]):
			normal_packs[f"pack{i}"]["cards"].append(pools["colorless"][i*specs["colorless_ratio"]+j])
		for j in range(specs["multi_ratio"]):
			normal_packs[f"pack{i}"]["cards"].append(pools["multicolored"][i*specs["multi_ratio"]+j])
		shuffle(normal_packs[f"pack{i}"]["cards"])

		for j in range(specs["uncut_pack_size"]-15):
			cut_cards.append(normal_packs[f"pack{i}"]["cards"].pop())
	shuffle(cut_cards)
	for i in range(specs["number_of_structured_packs"], specs["player_count"]*specs["normal_rounds"]):
		normal_packs[f"pack{i}"]["cards"] = cut_cards[:15]
		cut_cards = cut_cards[15:]
	return normal_packs

def deal_packs(commander_packs, normal_packs, player_count, normal_rounds):
	shuffled_packs = []
	for i in range(len(normal_packs)):
		shuffled_packs.append(normal_packs[f"pack{i}"])
	shuffle(shuffled_packs)
	rounds = {i: [] for i in range(normal_rounds+1)}
	if commander_packs:
		rounds[0] = commander_packs
	else:
		del rounds[0]
	for i in range(normal_rounds):
		dealt_packs = {}
		for j in range(player_count):
			dealt_packs[f"pack{j}"] = shuffled_packs.pop(0)
		rounds[i+1] = dealt_packs
	return rounds