from operations.add_ui import add_ui
from operations.remove_ui import remove_ui
from operations.search_ui import search_ui
from operations.commanders_ui import manage_commanders_ui

def main_ui(cursor):
	instructions = "UI operations\n1: Add cards to the database\n2: Search for cards in the database\n3: Remove cards from the database\n4: Manage Commanders\n0: Exit"
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
		else:
			print("Invalid choice.")
		print(instructions)
		choice = input("Enter your choice: ")
	return