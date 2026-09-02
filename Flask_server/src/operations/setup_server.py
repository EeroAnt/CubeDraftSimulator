def setup(specs, identifier="test"):
  from src.operations.draft.draft_setup import setup_draft
  from src.operations.database.db import connect_to_db, close_db
  from time import time
	
  start = time()
  cur, conn = connect_to_db()

  try:
    commander_packs, normal_packs, errors = setup_draft(specs, identifier, cur, conn)
		
    if errors:
      print("Draft setup failed.")
      print(errors)
      return errors
		
    print("Draft setup complete.")
    return identifier
	
  finally:
    if cur:
      cur.close()
    close_db(conn)
    print("Time elapsed: " + str(time() - start) + " seconds.")
