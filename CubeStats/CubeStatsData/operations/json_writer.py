from json import dump

def write_json(data):
  with open("data.json", "w") as f:
    dump(data, f, indent=2)
