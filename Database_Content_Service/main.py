from operations.main_ui  import main_ui
from operations.database_connection import connect_to_cloud_db, close_cloud_db

def main():
	cursor, connection = connect_to_cloud_db()
	main_ui(cursor)
	close_cloud_db(connection)
	return

if __name__ == "__main__":
	main()