from operations.database_functions import update_draft_pool

def draft_pool_change_ui(cursor):
	card_id = input("Enter the card ID: ")
	update_draft_pool(cursor, card_id)
	return