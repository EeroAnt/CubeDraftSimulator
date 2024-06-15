from operations.database_functions import add_card, add_multiple_cards

def add_ui(cursor):
	print("Add cards to the database")
	print("1: Add a card")
	print("2: Add multiple cards")
	print("0: Cancel")
	choice = input("Enter your choice: ")
	while choice != "0":
		if choice == "1":
			card_name = input("Enter the name of the card to add (0 to cancel): ")
			add_card(cursor, card_name)
		elif choice == "2":
			add_multiple_cards(cursor)
		else:
			print("Invalid choice.")
		choice = input("Enter your choice: ")
	return