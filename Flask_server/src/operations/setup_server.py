def setup(specs, identifier="test"):
	from src.operations.draft.draft_setup import setup_draft
	from src.operations.database.db import close_db
	from time import time
	
	start = time()
	commander_packs, normal_packs, conn, server, errors = setup_draft(specs, identifier)
	
	if errors:
		print("Draft setup failed.")
		print(errors)
		close_db(conn)
		return errors
	
	close_db(conn, server)
	print("Draft setup complete.")
	print("Time elapsed: " + str(time() - start) + " seconds.")
	return identifier