from src.operations.database.db import connect_to_db, close_db
from src.operations.database.queries.read_draft_data_queries import draft_pool_ratings_query, bottom_cards_query, multipool_distribution_query, commander_color_distribution_query, commanders_query, bottom_cards_from_multi_query
from json import dump

def generate_data(identifier):
	cur, conn, server = connect_to_db()
	cur.execute(draft_pool_ratings_query())
	draft_pool_ratings = cur.fetchall()

	cleaned_draft_pool_ratings = [(float(rating), letter) for rating, letter in draft_pool_ratings]

	data = {
		"status": "success",
		"draft pool ratings": cleaned_draft_pool_ratings,
		"bottom cards query": {}
	}
	
	for i in ["W", "U", "B", "R", "G", "C", "M", "L"]:
		cur.execute(bottom_cards_query(i,30))
		data["bottom cards query"][i] = cur.fetchall()
		data["bottom cards query"][i] = [(name, image_url, backside_image_url, float(avg_pick), amount_of_picks) for name, image_url, backside_image_url, avg_pick, amount_of_picks in data["bottom cards query"][i]]
	
	cur.execute(multipool_distribution_query())
	data["multipool distribution"] = cur.fetchall()

	cur.execute(commander_color_distribution_query())
	data["commander color distribution"] = cur.fetchall()

	cur.execute(commanders_query())
	data["commanders"] = cur.fetchall()

	multi_color_identities = [color_identity for amount, color_identity in data["multipool distribution"]]
	for i in multi_color_identities:
		cur.execute(bottom_cards_from_multi_query(i, 5))
		data["bottom cards query"][i] = cur.fetchall()
		data["bottom cards query"][i] = [(name, image_url, backside_image_url, float(avg_pick), amount_of_picks) for name, image_url, backside_image_url, avg_pick, amount_of_picks in data["bottom cards query"][i]]


	close_db(conn, server)

	with open(f"templates/data{identifier}.json", "w") as f:
		dump(data, f)