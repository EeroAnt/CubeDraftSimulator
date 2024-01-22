from Backend.pool_generation import generate_pools
from Backend.packs import *
from Backend.json_generator import generate_json

def setup_draft(player_count, identifier):
	pools, conn = generate_pools(player_count)
	commander_packs = create_commander_packs(pools["commanders"])
	normal_packs = create_normal_packs(pools, player_count)
	finished_setup = deal_packs(commander_packs, normal_packs, player_count)
	generate_json(finished_setup, identifier)
	return commander_packs, normal_packs, conn