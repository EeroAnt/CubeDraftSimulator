from sshtunnel import SSHTunnelForwarder
from paramiko import RSAKey
from io import StringIO
import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def connect_to_db():

  conn = psycopg2.connect(
    host='127.0.0.1',
    user=getenv("DB_USER"),
		password=getenv("DB_PASSWORD"), 
		port=6543,
		database=getenv("DB_NAME")
  )
	
  cur = conn.cursor()

  return cur, conn

def close_db(cnx):
  cnx.close()