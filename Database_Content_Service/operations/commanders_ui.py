from operations.database_functions import add_commander, add_multiple_commanders, remove_commander

def manage_commanders_ui(cursor):
	print("Manage Commanders")
	print("1: Add a commander")
	print("2: Add multiple commanders")
	print("3: Remove a commander")
	print("0: Cancel")
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
		print("1: Add a commander")
		print("2: Remove a commander")
		print("0: Cancel")
		choice = input("Enter your choice: ")
	return