from Database_Handling.draft_setup import setup_draft
from Database_Handling.cloud_db import close_cloud_db

pools, conn = setup_draft(4)

close_cloud_db(conn)

print("Draft setup complete.")
for i in pools.keys():
    print(i, len(pools[i]))
