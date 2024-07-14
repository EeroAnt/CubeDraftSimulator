from src.operations.draft.pool_generation import generate_pools
from src.operations.draft.packs import *
from src.operations.draft.cube_size_checks import check_cube_size
from src.operations.json_generator import generate_json
from random import choices
from string import ascii_letters, digits
from math import ceil


def setup_draft(player_count, identifier, commander_packs_included=True, normal_rounds=8, multi_ratio=3, generic_ratio=2, colorless_ratio=3, land_ratio=2):
	specs = {
		"player_count": player_count,
		"commander_packs": commander_packs_included,
		"normal_rounds": normal_rounds,
		"multi_ratio": multi_ratio,
		"generic_ratio": generic_ratio,
		"colorless_ratio": colorless_ratio,
		"land_ratio": land_ratio,
		"uncut_pack_size": multi_ratio + generic_ratio*5 + colorless_ratio + land_ratio
	}
	specs["number_of_structured_packs"] = ceil(15*specs["normal_rounds"]*specs["player_count"]/specs["uncut_pack_size"])
	errors = check_cube_size(specs)
	if errors:
		failed_setup = {"state":"Setup Failed", "errors": errors}
		generate_json(failed_setup, identifier)
		return None, None, conn, errors
	pools, conn = generate_pools(specs)
	if commander_packs_included:
		commander_packs = create_commander_packs(pools["commanders"])
	normal_packs = create_normal_packs(pools, specs)
	dealt_packs = deal_packs(commander_packs, normal_packs, specs["player_count"])
	finished_setup = generate_table(dealt_packs, specs["player_count"])
	generate_json(finished_setup, identifier)
	return commander_packs, normal_packs, conn, errors


def generate_table(setup_to_finish, player_count):
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