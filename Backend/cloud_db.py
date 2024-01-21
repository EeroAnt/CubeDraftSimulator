import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def connect_to_cloud_db():
	cnx = psycopg2.connect(
		user=getenv("CLOUDDB_USER"), 
		password=getenv("CLOUDDB_PASSWORD"), 
		host=getenv("CLOUDDB_HOST"),
		port=getenv("CLOUDDB_PORT"), 
		database=getenv("CLOUDDB_NAME")
	)

	cur_cloud = cnx.cursor()

	return cur_cloud, cnx

def close_cloud_db(cnx):
	cnx.close()
	print("Connection to cloud database closed.")