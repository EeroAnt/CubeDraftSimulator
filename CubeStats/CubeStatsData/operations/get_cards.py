from operations.queries import *

def generate_cards_object(cursor):
    cards = get_cards(cursor)
    commander_ids = get_commander_ids(cursor)
    
    pick_rates = get_pick_rates(cursor)
    commander_pick_rates = get_commander_pick_rates(cursor)

    picked_cards = []
    cards_not_picked = []
    for card in cards:

        if card["id"] in commander_ids:
            card["is_commander"] = "true"
        if card["id"] in pick_rates:
            card["avg_pick"] = pick_rates[card["id"]]["avg_pick"]
            card["amount_of_picks"] = pick_rates[card["id"]]["amount_of_picks"]
        if card["id"] in commander_pick_rates:
            card["avg_commander_pick"] = commander_pick_rates[card["id"]]["avg_pick"]
            card["amount_of_commander_picks"] = commander_pick_rates[card["id"]]["amount_of_picks"]
        if card["id"] in pick_rates or card["id"] in commander_pick_rates:
            picked_cards.append(card)
        else:
            cards_not_picked.append(card)

    cards_data = {
        "picked_cards": picked_cards,
        "cards_not_picked": cards_not_picked
    }

    return cards_data

def get_cards(cursor):
    cursor.execute(GET_CARDS_QUERY)
    rows = cursor.fetchall()
    return [
        {
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
        for row in rows
    ]

def get_commander_ids(cursor):
    cursor.execute(GET_COMMANDER_IDS_QUERY)
    rows = cursor.fetchall()
    return [
        row[0]
        for row in rows
    ]

def get_pick_rates(cursor):
    cursor.execute(GET_PICK_RATES_QUERY)
    rows = cursor.fetchall()
    return {
        row[0]: {
            "avg_pick": row[1],
            "amount_of_picks": row[2]
        }
        for row in rows
    }

def get_commander_pick_rates(cursor):
    cursor.execute(GET_COMMANDER_PICK_RATES_QUERY)
    rows = cursor.fetchall()
    return {
        row[0]: {
            "avg_pick": row[1],
            "amount_of_picks": row[2]
        }
        for row in rows
    }