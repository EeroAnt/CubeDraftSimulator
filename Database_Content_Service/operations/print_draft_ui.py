from operations.database_functions import print_draft_contents

DRAFTS_QUERY = """SELECT draft_id, string_agg(DISTINCT username, ', ' ORDER BY username) AS users
FROM Drafts
GROUP BY draft_id
ORDER BY draft_id;
"""

def print_draft_ui(cursor):
    print("Print a draft\n")
    instructions = """  1: List all drafts
  2: Print a draft
  0: Exit
"""
    print(instructions)
    choice = input("Enter your choice: ")
    while choice != "0":
        if choice == "1":
            cursor.execute(DRAFTS_QUERY)
            drafts = cursor.fetchall()
            print("\nDrafts:")
            for draft in drafts:
                print(f"Draft ID: {draft[0]}, Users: {draft[1]}")
        elif choice == "2":
            draft_id = input("Enter the draft ID you want to print: ")
            print_draft_contents(cursor, draft_id)
        else:
            print("Invalid choice.")
        print("\n" + "-" * 40 + "\n")
        print(instructions)
        choice = input("Enter your choice: ")