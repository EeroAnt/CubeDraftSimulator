from operations.json_writer import write_json
from operations.card_data import generate_cards_object
from operations.temp_tables_creator import create_temp_tables
from operations.aggregates import get_aggregates
from operations.colors import get_colors

def generateDataCache(cursor):
  data = {}
  create_temp_tables(cursor)
  data["aggregates"] = get_aggregates(cursor)
  data["cards"] = generate_cards_object(cursor)
  data["colors"] = get_colors(cursor)
  write_json(data)
  return

