import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()
cnx = psycopg2.connect(user="cubeadmin", password=getenv("CLOUDDB-PASSWORD"), host="cube-simulator-db.postgres.database.azure.com", port=5432, database="cubedb")
cur = cnx.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS test (id serial PRIMARY KEY, num integer, data varchar);")
cur.execute("INSERT INTO test (num, data) VALUES (%s, %s)", (100, "abc'def"))
cnx.commit()

cur.execute("SELECT * FROM test;")
print(cur.fetchall())

cnx.close()