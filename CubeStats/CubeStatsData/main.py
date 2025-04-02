import sys
import os
from operations.data_cache_generator import generateDataCache

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "SharedDBConnection")))

from database_connection import connect_to_db, close_db


def main():
  cursor, connection = connect_to_db()
  generateDataCache(cursor)
  close_db(connection)
  return

if __name__ == "__main__":
  main()