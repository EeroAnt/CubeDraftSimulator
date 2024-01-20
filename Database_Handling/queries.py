
def get_commanders_query():
	sql = """SELECT 
	   *
	  FROM
	    Cards
	  WHERE
	    id IN (
		  SELECT
		    card_id
		  FROM
		    Commanders
		  WHERE
		    id IN (
			  SELECT
			    id
			  FROM
			    Commanders
			  ORDER BY
			    RANDOM()
			  LIMIT
			    %s)
			);"""
	return sql

def multicolored_pool_query(commander_ids):
	sql = f"""SELECT
		*
	  FROM
	    Cards
	  WHERE
	    draft_pool='M'
	  AND
		id NOT IN (
		{','.join(commander_ids)})
	  ORDER BY
	    RANDOM()
	  LIMIT
	    %s;"""
	return sql