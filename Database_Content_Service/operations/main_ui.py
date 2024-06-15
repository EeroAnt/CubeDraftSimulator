from operations.add_ui import add_ui
from operations.remove_ui import remove_ui
from operations.search_ui import search_ui

def main_ui(cursor):
	print("UI operations")
	print("1: Add cards to the database")
	print("2: Search for cards in the database")
	print("3: Remove cards from the database")
	print("0: Exit")
	choice = input("Enter your choice: ")
	while choice != "0":
		if choice == "1":
			add_ui(cursor)
		elif choice == "2":
			search_ui(cursor)
		elif choice == "3":
			remove_ui(cursor)
		else:
			print("Invalid choice.")
		print("1: Add cards to the database")
		print("2: Search for cards in the database")
		print("3: Remove cards from the database")
		print("0: Exit")
		choice = input("Enter your choice: ")
	return