from Backend.draft_setup import setup_draft
from Backend.cloud_db import close_cloud_db
from time import time
start = time()
commander_packs, normal_packs, conn = setup_draft(4, identifier="test")

close_cloud_db(conn)

print("Draft setup complete.")
print("Time elapsed: " + str(time() - start) + " seconds.")
	