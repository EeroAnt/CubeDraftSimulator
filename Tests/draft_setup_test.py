import unittest
from Backend.draft_setup import setup_draft
from Backend.cloud_db import close_cloud_db


class TestGeneratePools(unittest.TestCase):
	def setUp(self):
		self.commander_packs, self.conn = setup_draft(8)

	def test_size_of_commander_packs(self):
		for i in self.commander_packs.keys():
			self.assertEqual(len(self.commander_packs[i]), 5)
	
	def test_only_legendaries_in_commander_packs(self):
		for i in self.commander_packs.keys():
			for j in self.commander_packs[i]:
				self.assertEqual("Legendary" in j["types"], True)

    