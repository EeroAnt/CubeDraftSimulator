def api_parameter_errors(identifier, player_count):
	try:
		int(player_count)
	except:
		return "Invalid player count"
	if int(player_count) not in range(4, 10):
		return "Invalid player count"
	if len(identifier) > 10:
		return "Invalid identifier"
	return None