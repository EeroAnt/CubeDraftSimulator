
def commander_pool_query():
	sql = """
	SELECT 
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
			  card_id
			FROM
			  Commanders
			ORDER BY
			  RANDOM()
			LIMIT
			  %s));"""
	return sql

def multicolored_pool_query(commander_ids):
	if len(commander_ids) == 0:
		sql = """
		SELECT
		  *
		FROM
		  Cards
		WHERE
		  draft_pool='M'
		ORDER BY
		  RANDOM()
		LIMIT
		  %s;"""
	else:
		sql = f"""
		SELECT
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

def generic_pool_query(pool):
	sql = f"""
	SELECT
	  *
	FROM
	  Cards
	WHERE
	  draft_pool='{pool}'
	ORDER BY
	  RANDOM()
	LIMIT
	  %s;"""
	return sql

def sending_picks_query():
	sql = """
	INSERT INTO
	  picks (
		card_id, 
		pick_number
		) 
	  VALUES
	    (%s,%s);"""
	return sql

def sending_commander_picks_query():
	sql = """
	INSERT INTO
	  picks (
		card_id, 
		commander_pick_number
		) 
	  VALUES
	    (%s,%s);"""
	return sql

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

def cube_size_query():
	sql = """
	SELECT
	  COUNT(*)
	FROM
	  Cards;"""
	return sql

def pool_size_query():
	sql = """
	SELECT
	  COUNT(*)
	FROM
	  Cards
	WHERE
	  draft_pool=%s;"""
	return sql