from src.operations.draft.pool_generation import generate_pools
from src.operations.draft.packs import *
from src.operations.draft.cube_size_checks import check_cube_size
from src.operations.json_generator import generate_json
from random import choices
from string import ascii_letters, digits


def setup_draft(specs, identifier):
	errors = check_cube_size(specs)
	if errors:
		failed_setup = {"state":"Setup Failed", "errors": errors}
		generate_json(failed_setup, identifier)
		return None, None, None, errors
	pools, conn = generate_pools(specs)
	if specs["commander_packs"]:
		commander_packs = create_commander_packs(pools["commanders"])
	else:
		commander_packs = None
	normal_packs = create_normal_packs(pools, specs)
	dealt_packs = deal_packs(commander_packs, normal_packs, specs["player_count"], specs["normal_rounds"])
	finished_setup = generate_table(dealt_packs, specs["player_count"], specs["normal_rounds"], specs["commander_packs"])
	generate_json(finished_setup, identifier)
	return commander_packs, normal_packs, conn, errors


def generate_table(setup_to_finish, player_count, normal_rounds=8, commander_packs=True):
	finished_setup= {
		"state":"Setup Complete",
		"table": {},
		"rounds": setup_to_finish
		}
	for i in range(player_count):
		finished_setup["table"][f"seat{i}"] = {
			"main": [],
			"side": [],
			"packAtHand": {"cards" : [], "picks" : []},
			"queue": [],
			"token" : "".join(choices(ascii_letters+digits, k=4))
		}

	return finished_setup

if __name__ == "__main__":
	print("".join(choices(ascii_letters+digits, k=4)))