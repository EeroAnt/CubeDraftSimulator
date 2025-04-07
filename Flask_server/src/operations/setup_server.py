def setup(specs, identifier="test"):
  from src.operations.draft.draft_setup import setup_draft
  from src.operations.database.db import close_db
  from src.operations.database.ssh_tunnel import create_tunnel, close_tunnel
  from time import time
	
  start = time()
  server = create_tunnel()
  conn = None

  try:
    commander_packs, normal_packs, conn, errors = setup_draft(specs, identifier)
		
    if errors:
      print("Draft setup failed.")
      print(errors)
      return errors
		
    print("Draft setup complete.")
    return identifier
	
  finally:
    if conn:
      close_db(conn)
    if server:
      close_tunnel(server)
    print("Time elapsed: " + str(time() - start) + " seconds.")
