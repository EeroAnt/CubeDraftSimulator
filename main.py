from Backend.draft_setup import setup_draft
from Backend.cloud_db import close_cloud_db

commander_packs, normal_packs, conn = setup_draft(4)

close_cloud_db(conn)

print("Draft setup complete.")
# for i in range(5):
# 	print("Pack " + str(i+1) + ":")
# 	for j in normal_packs[i]:
# 		print(j["name"])
# 		print(j["draft_pool"])
	