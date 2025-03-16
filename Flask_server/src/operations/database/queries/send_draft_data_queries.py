
def sending_packs_query():
	sql = """
	INSERT INTO
	  picked_packs (
		pick1, 
		pick2,
		pick3,
		pick4,
		pick5,
		pick6,
		pick7,
		pick8,
		pick9,
		pick10,
		pick11,
		pick12,
		pick13,
		pick14,
		pick15
		) 
	  VALUES
	    (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"""
	return sql

def sending_commander_packs_query():
	sql = """
	INSERT INTO
	  picked_commander_packs (
		pick1, 
		pick2,
		pick3,
		pick4,
		pick5
		) 
	  VALUES
	    (%s,%s,%s,%s,%s);"""
	return sql