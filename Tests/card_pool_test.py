import unittest
from Backend.pool_generation import generate_pools
from Backend.cloud_db import close_cloud_db


class TestGeneratePools(unittest.TestCase):
	@classmethod
	def setUpClass(self):
		self.pools, self.conn = generate_pools(8)
	
	def test_amount_of_commanders(self):
		self.assertEqual(len(self.pools["commanders"]), 40)
	
	def test_amount_of_multicolored_cards(self):
		self.assertEqual(len(self.pools["multicolored"]), 162)
	
	def test_that_no_commanders_are_in_multicolored_pool(self):
		for commander in self.pools["commanders"]:
			self.assertNotIn(commander, self.pools["multicolored"])
	
	def test_amount_of_white_cards(self):
		self.assertEqual(len(self.pools["white"]), 108)
	
	def test_only_cards_from_white_pool_in_white_pool(self):
		for card in self.pools["white"]:
			self.assertEqual(card["draft_pool"], "W")

	@classmethod
	def tearDownClass(self):
		close_cloud_db(self.conn)