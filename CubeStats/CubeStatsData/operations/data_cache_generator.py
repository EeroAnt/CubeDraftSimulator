from operations.json_writer import write_json
from operations.get_test_cards import get_test_cards

def generateDataCache(cursor):
  # Run the SQL queries to generate the data cache
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
  data["cards"] = get_test_cards(cursor)
  write_json(data)
  return