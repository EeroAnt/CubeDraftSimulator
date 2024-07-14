from src.operations.database.queries import *

def check_cube_size(cur, specs):
	errors = []
	
	cur.execute(cube_size_query(),)
	cube_size = cur.fetchone()[0]
	if cube_size < specs["number_of_structured_packs"]*15:
		errors.append("Cube size is too small.")
		return errors
	
	for i in ["W","U","B","R","G"]:
		cur.execute(pool_size_query(),(i,))
		pool_size = cur.fetchone()[0]
		if pool_size < specs["number_of_structured_packs"]*specs["generic_ratio"]:
			errors.append(f"{i} pool size is too small.")
	
	cur.execute(pool_size_query(),("L",))
	pool_size = cur.fetchone()[0]
	if pool_size < specs["number_of_structured_packs"]*specs["land_ratio"]:
		errors.append("Land pool size is too small.")
	
	cur.execute(pool_size_query(),("C",))
	pool_size = cur.fetchone()[0]
	if pool_size < specs["number_of_structured_packs"]*specs["colorless_ratio"]:
		errors.append("Colorless pool size is too small.")
	
	cur.execute(pool_size_query(),("M",))
	pool_size = cur.fetchone()[0]
	if pool_size < specs["number_of_structured_packs"]*specs["multi_ratio"]:
		errors.append("Multicolored pool size is too small.")
	
	return errors