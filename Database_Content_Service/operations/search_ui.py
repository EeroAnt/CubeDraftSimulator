from operations.database_functions import search_cards

def search_ui(cursor):
	print("Search for cards in the database\n")
	instructions = """	1: Search by card name
	2: Search by card type
	3: Search by text
	0: Cancel"""
	print(instructions)
	choice= input("Enter your choice: ")
	while choice != "0":
		query = str(input("Enter the query you want to search for (0 to cancel):"))
		while query != "0":
			query = "%" + query + "%"
			search_cards(cursor, query, choice)		
			input("Press enter to continue.")
			query = str(input("Enter the query you want to search for (0 to cancel):"))
		choice= input("Enter your choice: ")
	return