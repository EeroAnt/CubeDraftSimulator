import unittest
from Database_Handling.pool_generation import generate_pools

class TestGeneratePools(unittest.TestCase):
	def setUp(self):
		self.pools = generate_pools(8)
	
	def test_amount_of_commanders(self):
		self.assertEqual(len(self.pools["commanders"]), 40)
	
	def test_amount_of_multicolored_cards(self):
		self.assertEqual(len(self.pools["multicolored_pool"]), 162)
	
	def test_that_no_commanders_are_in_multicolored_pool(self):
		for commander in self.pools["commanders"]:
			self.assertNotIn(commander, self.pools["multicolored_pool"])
	
	def test_amount_of_white_cards(self):
		self.assertEqual(len(self.pools["white"]), 108)
	
