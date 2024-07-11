from operations.database_functions import remove_card, remove_multiple_cards

def remove_ui(cursor):
	print("Remove cards from the database")
	choice = input("1: Remove a card\n2: Remove multiple cards\n0: Cancel\nEnter your choice: ")
	while choice != "0":
		if choice == "1":
			try:
				id = int(input("Enter the id of the card to remove (0 to cancel): "))
			except ValueError:
				print("Invalid id.")
				return
			while id != "0":
				remove_card(cursor, id)
				id = input("Enter the id of the card to remove (0 to cancel): ")
		elif choice == "2":
			remove_multiple_cards(cursor)
		else:
			print("Invalid choice.")
		choice = input("1: Remove a card\n2: Remove multiple cards\n0: Cancel\nEnter your choice: ")
	
	return