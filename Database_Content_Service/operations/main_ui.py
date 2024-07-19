from operations.add_ui import add_ui
from operations.remove_ui import remove_ui
from operations.search_ui import search_ui
from operations.commanders_ui import manage_commanders_ui
from operations.database_functions import print_cube_contents
from operations.draft_pool_change_ui import draft_pool_change_ui

def main_ui(cursor):
	instructions = """UI operations\n
	1: Add cards to the database\n
	2: Search for cards in the database\n
	3: Remove cards from the database\n
	4: Manage Commanders\n
	5: Change draft pool of a card\n
	6: Print cube contents\n
	0: Exit"""
	print(instructions)
	choice = input("Enter your choice: ")
	while choice != "0":
		if choice == "1":
			add_ui(cursor)
		elif choice == "2":
			search_ui(cursor)
		elif choice == "3":
			remove_ui(cursor)
		elif choice == "4":
			manage_commanders_ui(cursor)
		elif choice == "5":
			draft_pool_change_ui(cursor)
		elif choice == "6":
			print_cube_contents(cursor)
		else:
			print("Invalid choice.")
		print(instructions)
		choice = input("Enter your choice: ")
	return