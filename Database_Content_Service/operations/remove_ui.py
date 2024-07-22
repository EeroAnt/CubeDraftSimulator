from operations.database_functions import remove_card, remove_multiple_cards

def remove_ui(cursor):
	print("Remove cards from the database\n")
	instructions = """	1: Remove a card
	2: Remove multiple cards
	0: Cancel"""
	print(instructions)
	choice = input("Enter your choice: ")
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
		input("Press enter to continue.")
		print(instructions)
		choice = input("Enter your choice: ")
	
	return