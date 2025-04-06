from sshtunnel import SSHTunnelForwarder
from paramiko import RSAKey
from io import StringIO
import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def connect_to_db():
  print("Connecting to DB...")

  key_str = getenv("SSH_KEY")
  passphrase = getenv("SSH_PASSPHRASE", None)
  private_key = RSAKey.from_private_key(
    StringIO(key_str),
    password=passphrase
    )
  server = SSHTunnelForwarder(
    (getenv("DNS"), int(getenv("DNS_PORT"))),
    ssh_username=getenv("SSH_USER"),
    ssh_pkey=private_key, 
    ssh_password=getenv("SSH_PASSPHRASE"),
    remote_bind_address=('127.0.0.1', int(getenv("DB_PORT"))),
    local_bind_address=('0.0.0.0', 6543),
    set_keepalive=30,
  )

  server.start()

  conn = psycopg2.connect(
    host='127.0.0.1',
    user=getenv("DB_USER"),
		password=getenv("DB_PASSWORD"), 
		port=6543,
		database=getenv("DB_NAME")
  )
	
  cur = conn.cursor()

  return cur, conn, server

def close_db(cnx, server):
  print("Closing DB connection...")
  cnx.close()
  server.stop()