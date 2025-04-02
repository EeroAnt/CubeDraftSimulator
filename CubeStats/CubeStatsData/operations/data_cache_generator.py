from operations.json_writer import write_json

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
  data["best_cards"] = {
    "single_color": {
      "R": ["Lightning Bolt", "Shock"],
      "G": ["Llanowar Elves", "Giant Growth"],
      "B": ["Doom Blade", "Thoughtseize"],
      "W": ["Path to Exile", "Swords to Plowshares"],
      "U": ["Counterspell", "Brainstorm"]
    },
    "multicolor": {
      "RG": ["Stormbreath Dragon", "Scute Swarm"],
      "UB": ["Snapcaster Mage", "Thoughtseize"],
      "RW": ["Lightning Helix", "Boros Charm"],
      "GU": ["Nissa, Who Shakes the World", "Hydroid Krasis"]
    }
  }
  write_json(data)
  return