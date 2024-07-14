import unittest
from src.operations.draft.pool_generation import generate_pools
from src.operations.database.cloud_db import close_cloud_db
from math import ceil

class TestGeneratePools(unittest.TestCase):
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
		specs_for_no_commanders = {
		"player_count": 8,
		"commander_packs": False,
		"normal_rounds": 8,
		"multi_ratio": 3,
		"generic_ratio": 2,
		"colorless_ratio": 3,
		"land_ratio":2,
		"uncut_pack_size": 18
	}
		specs_for_no_commanders["number_of_structured_packs"] = ceil(15*specs_for_no_commanders["normal_rounds"]*specs_for_no_commanders["player_count"]/specs_for_no_commanders["uncut_pack_size"])
		self.pools, self.conn = generate_pools(specs_for_commanders)
		self.pools_without_commanders, self.conn_without_commanders = generate_pools(specs_for_no_commanders)
	
	def test_amount_of_commanders(self):
		self.assertEqual(len(self.pools["commanders"]), 40)
	
	def test_amount_of_multicolored_cards(self):
		self.assertEqual(len(self.pools["multicolored"]), 162)
	
	def test_that_no_commanders_are_in_multicolored_pool(self):
		for commander in self.pools["commanders"]:
			self.assertNotIn(commander, self.pools["multicolored"])

	def test_multicolored_pool_works_without_commanders(self):
		self.assertEqual(len(self.pools_without_commanders["multicolored"]), 162)
	
	def test_amount_of_white_cards(self):
		self.assertEqual(len(self.pools["white"]), 108)
	
	def test_only_cards_from_white_pool_in_white_pool(self):
		for card in self.pools["white"]:
			self.assertEqual(card["draft_pool"], "W")

	@classmethod
	def tearDownClass(self):
		close_cloud_db(self.conn)