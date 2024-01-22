from random import shuffle
def create_commander_packs(commander_pool):
	commander_packs = {i: [] for i in range(len(commander_pool)//5)}
	shuffle(commander_pool)
	for i in range(len(commander_pool)):
		commander_packs[i % len(commander_pool)//5].append(commander_pool[i])
	return commander_packs

def create_normal_packs(pools, player_count):
	normal_packs = {i: [] for i in range(player_count*8)}
	cut_cards = []
	for i in range(len(pools["white"])//2):
		for j in ['white', 'blue', 'black', 'red', 'green', 'land']:
			normal_packs[i] += pools[j][i*2:i*2+2]
		for j in range(3):
			normal_packs[i].append(pools["multicolored"][i*3+j])
			normal_packs[i].append(pools["colorless"][i*3+j])
		shuffle(normal_packs[i])
		for j in range(3):
			cut_cards.append(normal_packs[i].pop())
	shuffle(cut_cards)
	for i in range(len(pools["white"])//2, player_count*8):
		normal_packs[i] = cut_cards[:15]
		cut_cards = cut_cards[15:]
	return normal_packs

def deal_packs(commander_packs, normal_packs, player_count):
	shuffled_packs = normal_packs.copy()
	shuffle(shuffled_packs)
	rounds = {i: [] for i in range(9)}
	rounds[0] = commander_packs
	for i in range(8):
		for j in range(player_count):
			rounds[i+1].append(shuffled_packs[j*8+i])
	return rounds