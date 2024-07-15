def setup(specs, identifier="test"):
	from src.operations.draft.draft_setup import setup_draft
	from src.operations.database.cloud_db import close_cloud_db
	from time import time
	
	start = time()
	commander_packs, normal_packs, conn, errors = setup_draft(specs, identifier)
		
	close_cloud_db(conn)
	
	if errors:
		print("Draft setup failed.")
		print(errors)
		return errors

	print("Draft setup complete.")
	print("Time elapsed: " + str(time() - start) + " seconds.")
	return identifier