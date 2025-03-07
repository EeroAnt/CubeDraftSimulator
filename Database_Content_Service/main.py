from operations.main_ui  import main_ui
from operations.database_connection import connect_to_db, close_db

def main():
	cursor, connection = connect_to_db()
	main_ui(cursor)
	close_db(connection)
	return

if __name__ == "__main__":
	main()