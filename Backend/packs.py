
def deal_commander_packs(commander_pool):
	commander_packs = {i: [] for i in range(len(commander_pool)//5)}
	print(commander_packs)
	for i in range(len(commander_pool)):
		commander_packs[i % len(commander_pool)//5].append(commander_pool[i])
	return commander_packs
