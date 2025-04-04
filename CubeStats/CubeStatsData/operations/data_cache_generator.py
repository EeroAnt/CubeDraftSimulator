from operations.json_writer import write_json
from operations.get_cards import generate_cards_object
from operations.temp_tables_creator import create_temp_tables

def generateDataCache(cursor):
  # Run the SQL queries to generate the data cache
  create_temp_tables(cursor)
  # Store the results in a dictionary
  # Write the json file
  data = {}
  # Example data
  data["single_color_avg_picks"] = {
    "R": 6,
    "G": 7,
    "B": 8,
    "W": 6.6,
    "U": 7.2
  }
  data["cards"] = generate_cards_object(cursor)
  write_json(data)
  return

