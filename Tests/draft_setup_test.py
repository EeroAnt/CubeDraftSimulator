import unittest
from Backend.draft_setup import setup_draft
from Backend.cloud_db import close_cloud_db

@classmethod
def tearDownClass(TestDraftSetup):
	close_cloud_db(TestDraftSetup.conn)

class TestDraftSetup(unittest.TestCase):
	def setUp(self):
		self.commander_packs, self.normal_packs, self.conn = setup_draft(8)

	def test_size_of_commander_packs(self):
		for i in self.commander_packs.keys():
			self.assertEqual(len(self.commander_packs[i]), 5)
	
	def test_only_legendaries_in_commander_packs(self):
		for i in self.commander_packs.keys():
			for j in self.commander_packs[i]:
				self.assertEqual("Legendary" in j["types"], True)
	
	def test_structured_packs_contents(self):
		for i in range(4):
			draft_pools = [d['draft_pool'] for d in self.normal_packs[i]]
			self.assertLessEqual(draft_pools.count('W'), 2)
			self.assertLessEqual(draft_pools.count('U'), 2)
			self.assertLessEqual(draft_pools.count('B'), 2)
			self.assertLessEqual(draft_pools.count('R'), 2)
			self.assertLessEqual(draft_pools.count('G'), 2)

    