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

def create_normal_packs(pools, player_count):
	normal_packs = {}
	for i in range(player_count*8):
		pack_name = f"pack{i}"
		normal_packs[pack_name] = {"cards": [], "picks": []}
	cut_cards = []
	for i in range(len(pools["white"])//2):
		for j in ['white', 'blue', 'black', 'red', 'green', 'land']:
			normal_packs[f"pack{i}"]["cards"] += pools[j][i*2:i*2+2]
		for j in range(3):
			normal_packs[f"pack{i}"]["cards"].append(pools["multicolored"][i*3+j])
			normal_packs[f"pack{i}"]["cards"].append(pools["colorless"][i*3+j])
		shuffle(normal_packs[f"pack{i}"]["cards"])
		for j in range(3):
			cut_cards.append(normal_packs[f"pack{i}"]["cards"].pop())
	shuffle(cut_cards)
	for i in range(len(pools["white"])//2, player_count*8):
		normal_packs[f"pack{i}"]["cards"] = cut_cards[:15]
		cut_cards = cut_cards[15:]
	return normal_packs

def deal_packs(commander_packs, normal_packs, player_count):
	shuffled_packs = []
	for i in range(len(normal_packs)):
		shuffled_packs.append(normal_packs[f"pack{i}"])
	shuffle(shuffled_packs)
	rounds = {i: [] for i in range(9)}
	rounds[0] = commander_packs
	for i in range(8):
		dealt_packs = {}
		for j in range(player_count):
			dealt_packs[f"pack{j}"] = shuffled_packs.pop(0)
		rounds[i+1] = dealt_packs
	return rounds