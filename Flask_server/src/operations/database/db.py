import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def connect_to_db():

  conn = psycopg2.connect(
    host=getenv("DB_HOST"),
    port=int(getenv("DB_PORT")),
    user=getenv("DB_USER"),
		password=getenv("DB_PASSWORD"), 
		database=getenv("DB_NAME"),
    sslmode="require",
  )
	
  cur = conn.cursor()

  return cur, conn

def close_db(cnx):
  cnx.close()