from Backend.pool_generation import generate_pools
from Backend.packs import deal_commander_packs, deal_normal_packs

def setup_draft(player_count):
	pools, conn = generate_pools(player_count)
	commander_packs = deal_commander_packs(pools["commanders"])
	normal_packs = deal_normal_packs(pools, player_count)
	return commander_packs, normal_packs, conn