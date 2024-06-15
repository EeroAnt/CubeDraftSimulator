from operations.database_functions import search_cards

def search_ui(cursor):
	print("Search for cards in the database")
	query = str(input("Enter the name of the card you want to search for (0 to cancel):"))
	while query != "0":
		query = "%" + query + "%"
		search_cards(cursor, query)
		query = str(input("Enter the name of the card you want to search for (0 to cancel):"))
	# Search for cards in the database
	return