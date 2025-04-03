from operations.queries import random_test_cards_query

def get_test_cards(cursor):
    print("Getting test cards")
    cursor.execute(random_test_cards_query(50))
    rows = cursor.fetchall()
    test_cards = []
    for row in rows:
        test_cards.append({
            "id": row[0],
            "name": row[1],
            "mv": row[2],
            "color_identity": row[3],
            "types": row[4],
            "oracle_text": row[5],
            "image_url": row[6],
            "backside_image_url": row[7],
            "draft_pool": row[8]
        })
    return test_cards
