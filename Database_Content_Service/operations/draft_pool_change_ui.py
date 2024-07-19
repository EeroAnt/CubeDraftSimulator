from operations.database_functions import update_draft_pool

def draft_pool_change_ui(cursor):
	instructions = """Draft pool change UI\n
	1: Update draft pool of a card\n
	0: Exit"""
	print(instructions)
	choice = input("Enter your choice: ")
	while choice != "0":
		if choice == "1":
			card_id = input("Enter the card ID: ")
			draft_pool = input("Enter the new draft pool: ")
			update_draft_pool(cursor, card_id, draft_pool)
		else:
			print("Invalid choice.")
		print(instructions)
		choice = input("Enter your choice: ")
	return