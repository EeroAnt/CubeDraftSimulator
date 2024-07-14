import unittest
from src.operations.database.cloud_db import close_cloud_db
from src.operations.draft.pool_generation import generate_pools
from src.operations.draft.cube_size_checks import check_cube_size
from src.operations.draft.packs import *
from src.operations.json_generator import generate_json
from src.operations.database.cloud_db import connect_to_cloud_db
from os import remove
from math import ceil


class TestSuccesfulDraftSetup(unittest.TestCase):
	@classmethod
	def setUpClass(self):
		specs_for_commanders = {
		"player_count": 8,
		"commander_packs": True,
		"normal_rounds": 8,
		"multi_ratio": 3,
		"generic_ratio": 2,
		"colorless_ratio": 3,
		"land_ratio":2,
		"uncut_pack_size": 18
	}
		specs_for_commanders["number_of_structured_packs"] = ceil(15*specs_for_commanders["normal_rounds"]*specs_for_commanders["player_count"]/specs_for_commanders["uncut_pack_size"])
		self.player_count = 8
		self.pool, self.conn = generate_pools(specs_for_commanders)
		close_cloud_db(self.conn)
		self.commander_packs = create_commander_packs(self.pool["commanders"])
		self.normal_packs = create_normal_packs(self.pool, specs_for_commanders)
		self.finished_setup = deal_packs(self.commander_packs, self.normal_packs, self.player_count)
		generate_json(self.finished_setup, "pytest")

	def test_size_of_commander_packs(self):
		for i in self.commander_packs.keys():
			self.assertEqual(len(self.commander_packs[i]["cards"]), 5)
	
	def test_only_legendaries_in_commander_packs(self):
		for i in self.commander_packs.keys():
			for j in self.commander_packs[i]["cards"]:
				self.assertEqual("Legendary" in j["types"], True)
	
	def test_structured_packs_contents(self):
		for i in range(4):
			draft_pools = [d['draft_pool'] for d in self.normal_packs[f"pack{i}"]["cards"]]
			self.assertLessEqual(draft_pools.count('W'), 2)
			self.assertLessEqual(draft_pools.count('U'), 2)
			self.assertLessEqual(draft_pools.count('B'), 2)
			self.assertLessEqual(draft_pools.count('R'), 2)
			self.assertLessEqual(draft_pools.count('G'), 2)
	
	def test_normal_packs_sizes(self):
		for i in range(64):
			self.assertEqual(len(self.normal_packs[f"pack{i}"]["cards"]), 15)
	
	def test_finished_setup_sizes(self):
		for i in range(8):
			self.assertEqual(len(self.finished_setup[0]["pack0"]["cards"]),5) 
		for i in range(1,9):
			self.assertEqual(len(self.finished_setup[i][f"pack0"]["cards"]),15)
	
	def test_finished_setup_contents(self):
		for i in range(8):
			self.assertEqual(len(self.finished_setup[0][f"pack{i}"]["cards"]), 5)
		for i in range(1,9):
			for j in range(8):
				self.assertEqual(len(self.finished_setup[i][f"pack{j}"]["cards"]), 15)
	
	@classmethod
	def tearDownClass(self):
		# print(path.exists("./Simulator/drafttest.json"))
		remove("./templates/draftpytest.json")

class TestFailedDraftSetup(unittest.TestCase):
	@classmethod
	def setUpClass(self):
		specs = {
		"player_count": 15,
		"commander_packs": True,
		"normal_rounds": 8,
		"multi_ratio": 3,
		"generic_ratio": 2,
		"colorless_ratio": 13,
		"land_ratio":12,
		"uncut_pack_size": 38
	}
		specs["number_of_structured_packs"] = ceil(15*specs["normal_rounds"]*specs["player_count"]/specs["uncut_pack_size"])
		self.cur, self.conn = connect_to_cloud_db()
		self.errors = check_cube_size(self.cur, specs)
		close_cloud_db(self.conn)
		generate_json({"state":"Setup Failed", "errors": self.errors}, "pytest")
	
	def test_too_many_players(self):
		self.assertEqual(self.errors, ['Land pool size is too small.', 'Colorless pool size is too small.'])
	
	@classmethod
	def tearDownClass(self):
		remove("./templates/draftpytest.json")