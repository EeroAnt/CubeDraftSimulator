from operations.database_functions import add_commander, add_multiple_commanders, remove_commander

def manage_commanders_ui(cursor):
	instructions = """1: Add a commander\n
	2: Add multiple commanders\n
	3: Remove a commander\n
	0: Cancel"""
	print("Manage Commanders")
	print(instructions)
	choice = input("Enter your choice: ")
	while choice != "0":
		if choice == "1":
			card_id = input("Enter the id of the card to add as a commander (0 to cancel): ")
			add_commander(cursor, card_id)
		elif choice == "2":
			add_multiple_commanders(cursor)
		elif choice == "3":
			card_id = input("Enter the id of the card to remove as a commander (0 to cancel): ")
			remove_commander(cursor, card_id)
		else:
			print("Invalid choice.")
		print(instructions)
		choice = input("Enter your choice: ")
	return