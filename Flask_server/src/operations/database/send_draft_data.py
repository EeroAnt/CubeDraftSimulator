from src.operations.database.db import connect_to_db, close_db
from src.operations.database.queries.send_draft_data_queries import sending_packs_query, sending_commander_packs_query, sending_draft_query
from src.operations.database.ssh_tunnel import create_tunnel, close_tunnel

def send_draft_data(data):
  server = create_tunnel()
  conn = None
  cur = None
  failed_entries = []

  try:
    
    cur, conn = connect_to_db()
    
    draft_data_decision = data.get("draftDataDecision", False)

    if draft_data_decision:

      commander_packs = list(filter(lambda x: len(x)==5, data["packs"]))
      normal_packs = list(filter(lambda x: len(x)!=5, data["packs"]))

      for pack in normal_packs:
        try:
          cur.execute(sending_packs_query(), (tuple(pack)))
          conn.commit()
        except Exception as e:
          conn.rollback()
          print(f"Failed to insert pack: {pack}, error: {e}")
          failed_entries.append({"type": "pack", "data": pack, "error": str(e)})

      for pack in commander_packs:
        try:
          cur.execute(sending_commander_packs_query(), (tuple(pack)))
          conn.commit()
        except Exception as e:
          conn.rollback()
          print(f"Failed to insert commander pack: {pack}, error: {e}")
          failed_entries.append({"type": "commander_pack", "data": pack, "error": str(e)})

    for i in data["pools"]:
      for card in i["cards"]:
        try:
          cur.execute(sending_draft_query(), (i["draftToken"], card, i["seatToken"], i["username"]))
          conn.commit()
        except Exception as e:
          conn.rollback()
          print(f"Failed to insert card: draft={i['draftToken']}, card={card}, seat={i['seatToken']}, user={i['username']}, error: {e}")
          failed_entries.append({"type": "draft", "data": {"draft_id": i["draftToken"], "card": card, "seat": i["seatToken"], "username": i["username"]}, "error": str(e)})

    if failed_entries:
      print(f"Completed with {len(failed_entries)} failures")
    
    return "success"

  except Exception as e:
    print("Unexpected error: ", e)
    return f"Failed to send draft data: {e}"

  finally:
    if cur:
      cur.close()
    if conn:
      close_db(conn)
    if server:
      close_tunnel(server)