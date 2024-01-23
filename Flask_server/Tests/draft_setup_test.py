import unittest
from src.operations.cloud_db import close_cloud_db
from src.operations.pool_generation import generate_pools
from src.operations.packs import *
from src.operations.json_generator import generate_json
from os import remove, path


class TestDraftSetup(unittest.TestCase):
	@classmethod
	def setUpClass(self):
		self.player_count = 8
		self.pool, self.conn = generate_pools(self.player_count)
		close_cloud_db(self.conn)
		self.commander_packs = create_commander_packs(self.pool["commanders"])
		self.normal_packs = create_normal_packs(self.pool, self.player_count)
		self.finished_setup = deal_packs(self.commander_packs, self.normal_packs, self.player_count)
		generate_json(self.finished_setup, "pytest")

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
	
	def test_normal_packs_sizes(self):
		for i in range(64):
			self.assertEqual(len(self.normal_packs[i]), 15)
	
	def test_finished_setup_sizes(self):
		self.assertEqual(len(self.finished_setup["pack0"][0]),5) 
		for i in range(1,9):
			self.assertEqual(len(self.finished_setup[f"pack{i}"][0]),15)
			
	
	@classmethod
	def tearDownClass(self):
		# print(path.exists("./Simulator/drafttest.json"))
		remove("./Flask_server/src/data/draftpytest.json")
