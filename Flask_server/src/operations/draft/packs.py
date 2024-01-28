from random import shuffle
def create_commander_packs(commander_pool):
	commander_packs = {f"pack{i}": [] for i in range(len(commander_pool)//5)}
	shuffle(commander_pool)
	for i in range(len(commander_pool)):
		commander_packs[f"pack{i % len(commander_pool)//5}"].append(commander_pool[i])
	return commander_packs

def create_normal_packs(pools, player_count):
	normal_packs = {f"pack{i}": [] for i in range(player_count*8)}
	cut_cards = []
	for i in range(len(pools["white"])//2):
		for j in ['white', 'blue', 'black', 'red', 'green', 'land']:
			normal_packs[f"pack{i}"] += pools[j][i*2:i*2+2]
		for j in range(3):
			normal_packs[f"pack{i}"].append(pools["multicolored"][i*3+j])
			normal_packs[f"pack{i}"].append(pools["colorless"][i*3+j])
		shuffle(normal_packs[f"pack{i}"])
		for j in range(3):
			cut_cards.append(normal_packs[f"pack{i}"].pop())
	shuffle(cut_cards)
	for i in range(len(pools["white"])//2, player_count*8):
		normal_packs[f"pack{i}"] = cut_cards[:15]
		cut_cards = cut_cards[15:]
	return normal_packs

def deal_packs(commander_packs, normal_packs, player_count):
	shuffled_packs = []
	for i in range(len(normal_packs)):
		shuffled_packs.append(normal_packs[f"pack{i}"])
	shuffle(shuffled_packs)
	rounds = {f"round{i}": [] for i in range(9)}
	rounds["round0"] = commander_packs
	for i in range(8):
		dealt_packs = {}
		for j in range(player_count):
			dealt_packs[f"pack{j}"] = shuffled_packs.pop(0)
		rounds[f"round{i+1}"] = dealt_packs
	return rounds