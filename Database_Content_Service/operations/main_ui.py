from operations.add_ui import add_ui
from operations.remove_ui import remove_ui
from operations.search_ui import search_ui
from operations.commanders_ui import manage_commanders_ui
from operations.database_functions import print_cube_contents, inspect_cube_contents
from operations.draft_pool_change_ui import draft_pool_change_ui


def main_ui(cursor):
	instructions = """Database Content Service\n
	1: Add cards to the database
	2: Search for cards in the database
	3: Remove cards from the database
	4: Manage Commanders
	5: Change draft pool of a card
	6: Print cube contents
	7: Inspect cube contents
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
		elif choice == "7":
			inspect_cube_contents(cursor)
			input("Press enter to continue.")
		else:
			print("Invalid choice.")
		print(instructions)
		choice = input("Enter your choice: ")
	return