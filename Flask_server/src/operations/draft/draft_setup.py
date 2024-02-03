from src.operations.draft.pool_generation import generate_pools
from src.operations.draft.packs import *
from src.operations.json_generator import generate_json
from random import choices
from string import ascii_letters, digits
def setup_draft(player_count, identifier):
	pools, conn = generate_pools(player_count)
	commander_packs = create_commander_packs(pools["commanders"])
	normal_packs = create_normal_packs(pools, player_count)
	dealt_packs = deal_packs(commander_packs, normal_packs, player_count)
	finished_setup = generate_table(dealt_packs, player_count)
	generate_json(finished_setup, identifier)
	return commander_packs, normal_packs, conn


def generate_table(setup_to_finish, player_count):
	setup_to_finish["table"] = {}
	for i in range(player_count):
		setup_to_finish["table"][f"seat{i}"] = {
			"main": [],
			"side": [],
			"packAtHand": [],
			"queue": [],
			"token" : "".join(choices(ascii_letters+digits, k=4))
		}
	return setup_to_finish

if __name__ == "__main__":
	print("".join(choices(ascii_letters+digits, k=4)))