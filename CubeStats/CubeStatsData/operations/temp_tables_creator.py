from operations.queries import *

def create_temp_tables(cursor):
    cursor.execute(GENERATE_PICKS_TABLE)
    cursor.execute(GENERATE_COMMANDER_PICKS_TABLE)