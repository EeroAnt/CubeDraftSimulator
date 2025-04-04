from json import dump
from utils.utils import DecimalEncoder

def write_json(data):
  with open("data.json", "w") as f:
    dump(data, f, indent=2, cls=DecimalEncoder)
