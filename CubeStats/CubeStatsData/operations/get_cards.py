from operations.queries import *

def generate_cards_object(cursor):
    commander_ids = get_commander_ids(cursor)
    cursor.execute(random_test_cards_query(50))
    rows = cursor.fetchall()
    cards = []
    for row in rows:
        card = {
            "id": row[0],
            "name": row[1],
            "mv": row[2],
            "color_identity": row[3],
            "types": row[4],
            "oracle_text": row[5],
            "image_url": row[6],
            "backside_image_url": row[7],
            "draft_pool": row[8]
        }

        if row[0] in commander_ids:
            card["is_commander"] = "true"

        cards.append(card)
    return cards

def get_commander_ids(cursor):
    cursor.execute(get_commander_ids_query())
    rows = cursor.fetchall()
    commander_ids = []
    for row in rows:
        commander_ids.append(row[0])
    return commander_ids