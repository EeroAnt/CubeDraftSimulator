from src.operations.database.db import connect_to_db, close_db
from src.operations.database.queries.send_draft_data_queries import sending_packs_query, sending_commander_packs_query, sending_draft_query
from src.operations.database.ssh_tunnel import create_tunnel, close_tunnel

def send_draft_data(data):
  # This is for testing purposes
  # with open ("data.json", "r") as f:
  #   data = load(f)
  server = create_tunnel()
  conn = None
  cur = None

  try:
    
    cur, conn = connect_to_db()
    cur.execute("BEGIN;")
    
    draft_data_decision = data.get("draftDataDecision", False)

    if draft_data_decision:

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

    return "success"

  except Exception as e:
    if cur:
      cur.execute("ROLLBACK;")
    print("Error while sending draft data: ", e)
    return f"Failed to send draft data: {e}"

  finally:
    if conn:
      close_db(conn)
    if server:
      close_tunnel(server)
