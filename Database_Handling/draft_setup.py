from Database_Handling.pool_generation import generate_pools

def setup_draft(player_count):
	pools = generate_pools(player_count)
	return pools