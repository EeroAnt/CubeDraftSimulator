def sql_to_dict(card_data):
	card_dict = {
		"id": card_data[0],
		"name": card_data[1],
		"mana_value": card_data[2],
		"color_identity": card_data[3],
		"types": card_data[4],
		"oracle_text": card_data[5],
		"image_url": card_data[6],
		"backside_image_url": card_data[7],
		"draft_pool": card_data[8]
	}
	return card_dict