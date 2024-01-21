from Backend.draft_setup import setup_draft
from Backend.cloud_db import close_cloud_db

commander_packs, conn = setup_draft(4)

close_cloud_db(conn)

print("Draft setup complete.")
for i in commander_packs.keys():
    print(i, len(commander_packs[i]))
    for j in commander_packs[i]:
        print(j["name"])
