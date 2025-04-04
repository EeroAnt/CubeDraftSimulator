from operations.json_writer import write_json
from operations.card_data import generate_cards_object
from operations.temp_tables_creator import create_temp_tables
from operations.aggragates import get_aggregates

def generateDataCache(cursor):
  data = {}
  create_temp_tables(cursor)
  data["aggragates"] = get_aggregates(cursor)
  data["cards"] = generate_cards_object(cursor)
  write_json(data)
  return

