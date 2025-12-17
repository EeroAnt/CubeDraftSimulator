from sshtunnel import SSHTunnelForwarder, BaseSSHTunnelForwarderError
from paramiko import RSAKey
import base64
from io import StringIO
from dotenv import load_dotenv
from os import getenv
from time import sleep

def create_tunnel(retries=3, delay=5):
  
  load_dotenv()

  key_str = base64.b64decode(getenv("SSH_KEY")).decode('utf-8')
  passphrase = getenv("SSH_PASSPHRASE", None)
  private_key = RSAKey.from_private_key(
    StringIO(key_str),
    password=passphrase
    )
  for attempt in range(retries):
    print(f"Attempting to create SSH tunnel... (Attempt {attempt+1}/{retries})")
    try:
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
    except BaseSSHTunnelForwarderError as e:
              print(f"SSH tunnel attempt {attempt+1} failed: {e}")
              if attempt < retries - 1:
                  sleep(delay)
              else:
                  raise

def close_tunnel(server):
  print("Tunnel closed.")
  server.stop()