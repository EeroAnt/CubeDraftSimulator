from Database_Handling.pool_generation import generate_pools

def setup_draft(player_count):
	pools, conn = generate_pools(player_count)
	return pools, conn