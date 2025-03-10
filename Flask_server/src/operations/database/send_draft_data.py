from src.operations.database.db import connect_to_db
from src.operations.database.queries import sending_picks_query, sending_commander_picks_query, sending_packs_query, sending_commander_packs_query

def send_draft_data(data):

	cur, conn = connect_to_db()
	cur.execute("BEGIN;")

	commander_packs = list(filter(lambda x: len(x)==5, data["packs"]))
	normal_packs = list(filter(lambda x: len(x)!=5, data["packs"]))

	for pack in normal_packs:
		cur.execute(sending_packs_query(), (tuple(pack)))

	for pack in commander_packs:
		cur.execute(sending_commander_packs_query(), (tuple(pack)))

	cur.execute("COMMIT;")
	conn.close()

	return "success"
