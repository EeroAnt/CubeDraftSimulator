from operations.database_functions import remove_card

def remove_ui(cursor):
	print("Remove cards from the database")
	try:
		id = int(input("Enter the id of the card to remove (0 to cancel): "))
	except ValueError:
		print("Invalid id.")
		return
	while id != "0":
		remove_card(cursor, id)
		id = input("Enter the id of the card to remove (0 to cancel): ")
	return