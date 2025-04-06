from src.operations.database.db import connect_to_db, close_db
from src.operations.database.queries.send_draft_data_queries import sending_packs_query, sending_commander_packs_query, sending_draft_query
from json import load

def send_draft_data(data):
  # This is for testing purposes
  # with open ("data.json", "r") as f:
  #   data = load(f)
  cur, conn, server = connect_to_db()
  cur.execute("BEGIN;")

  commander_packs = list(filter(lambda x: len(x)==5, data["packs"]))
  normal_packs = list(filter(lambda x: len(x)!=5, data["packs"]))

  for pack in normal_packs:
    cur.execute(sending_packs_query(), (tuple(pack)))

  for pack in commander_packs:
    cur.execute(sending_commander_packs_query(), (tuple(pack)))

  for i in data["pools"]:
    for card in i["cards"]:
      cur.execute(sending_draft_query(), (i["draftToken"], card, i["seatToken"], i["username"]))

  cur.execute("COMMIT;")
  close_db(conn, server)

  return "success"

