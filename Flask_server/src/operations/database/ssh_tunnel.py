from sshtunnel import SSHTunnelForwarder
from paramiko import RSAKey
from io import StringIO
from dotenv import load_dotenv
from os import getenv

def create_tunnel():
  
  load_dotenv()

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
  print("Tunnel created.")
  return server

def close_tunnel(server):
  print("Tunnel closed.")
  server.stop()