def setup(player_count, identifier="test"):
	from src.operations.draft_setup import setup_draft
	from src.operations.cloud_db import close_cloud_db
	from time import time
	
	start = time()
	commander_packs, normal_packs, conn = setup_draft(player_count, identifier)
		
	close_cloud_db(conn)
	
	print("Draft setup complete.")
	print("Time elapsed: " + str(time() - start) + " seconds.")