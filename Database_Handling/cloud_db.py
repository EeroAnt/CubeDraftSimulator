import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def connect_to_cloud_db():
	cnx = psycopg2.connect(
		user=getenv("CLOUDDB-USER"), 
		password=getenv("CLOUDDB-PASSWORD"), 
		host=getenv("CLOUDDB-HOST"),
		port=getenv("CLOUDDB-PORT"), 
		database=getenv("CLOUDDB-NAME")
	)

	cur_cloud = cnx.cursor()

	return cur_cloud, cnx

def close_cloud_db(cnx):
	cnx.close()
	print("Connection to cloud database closed.")