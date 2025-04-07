from src.operations.draft.draft_setup import setup_draft
from src.operations.database.db import close_db
from src.operations.database.ssh_tunnel import create_tunnel, close_tunnel
from time import time

start = time()
server = create_tunnel()
commander_packs, normal_packs, conn = setup_draft(4, identifier="test")

close_db(conn)
close_tunnel(server)

print("Draft setup complete.")
print("Time elapsed: " + str(time() - start) + " seconds.")