from operations.queries import *

def generate_cards_object(cursor):
    commander_ids = get_commander_ids(cursor)
    cursor.execute(random_test_cards_query(50))
    pick_rates = get_pick_rates(cursor)
    commander_pick_rates = get_commander_pick_rates(cursor)
    rows = cursor.fetchall()
    picked_cards = []
    cards_not_picked = []
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
        if row[0] in pick_rates:
            card["avg_pick"] = pick_rates[row[0]]["avg_pick"]
            card["amount_of_picks"] = pick_rates[row[0]]["amount_of_picks"]
        if row[0] in commander_pick_rates:
            card["avg_commander_pick"] = commander_pick_rates[row[0]]["avg_pick"]
            card["amount_of_commander_picks"] = commander_pick_rates[row[0]]["amount_of_picks"]
        if row[0] in pick_rates or row[0] in commander_pick_rates:
            picked_cards.append(card)
        else:
            cards_not_picked.append(card)

    cards = {
        "picked_cards": picked_cards,
        "cards_not_picked": cards_not_picked
    }

    return cards

def get_commander_ids(cursor):
    cursor.execute(get_commander_ids_query())
    rows = cursor.fetchall()
    commander_ids = []
    for row in rows:
        commander_ids.append(row[0])
    return commander_ids

def get_pick_rates(cursor):
    cursor.execute(get_pick_rates_query())
    rows = cursor.fetchall()
    pick_rates = {}
    for row in rows:
        pick_rates[row[0]] = {
            "avg_pick": row[1],
            "amount_of_picks": row[2]
        }
    return pick_rates

def get_commander_pick_rates(cursor):
    cursor.execute(get_commander_pick_rates_query())
    rows = cursor.fetchall()
    commander_pick_rates = {}
    for row in rows:
        commander_pick_rates[row[0]] = {
            "avg_pick": row[1],
            "amount_of_picks": row[2]
        }
    return commander_pick_rates