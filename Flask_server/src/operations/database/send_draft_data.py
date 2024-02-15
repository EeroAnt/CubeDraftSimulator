from src.operations.database.cloud_db import connect_to_cloud_db
from src.operations.database.queries import sending_picks_query, sending_commander_picks_query, sending_packs_query, sending_commander_packs_query

def send_draft_data(data):
	cur, conn = connect_to_cloud_db()
	cur.execute("BEGIN;")
	for card_id, pick_number in data["picks"].items():
		cur.execute(sending_picks_query(), (card_id, pick_number))

	for card_id, pick_number in data["commanderpicks"].items():
		cur.execute(sending_commander_picks_query(), (card_id, pick_number))

	commander_packs = list(filter(lambda x: len(x)==5, data["packs"]))
	normal_packs = list(filter(lambda x: len(x)!=5, data["packs"]))

	for pack in normal_packs:
		cur.execute(sending_packs_query(), (tuple(pack)))
	for pack in commander_packs:
		cur.execute(sending_commander_packs_query(), (tuple(pack)))
	cur.execute("COMMIT;")
	conn.close()
	return "success"
