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
		AND
      active = true
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
      active = true
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
  AND
    active = true
	ORDER BY
	  RANDOM()
	LIMIT
	  %s;"""
	return sql

def cube_size_query():
	sql = """
	SELECT
	  COUNT(*)
	FROM
	  Cards
	WHERE
	  active = true;"""
	return sql

def pool_size_query():
	sql = """
	SELECT
	  COUNT(*)
	FROM
	  Cards
	WHERE
	  draft_pool=%s
  AND
    active = true;"""
	return sql
