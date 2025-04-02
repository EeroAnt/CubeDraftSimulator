import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def connect_to_db():
	cnx = psycopg2.connect(
		user=getenv("DB_USER"), 
		password=getenv("DB_PASSWORD"), 
		host=getenv("DB_HOST"),
		port=getenv("DB_PORT"), 
		database=getenv("DB_NAME")
	)

	cur_cloud = cnx.cursor()

	return cur_cloud, cnx

def close_db(cnx):
	cnx.close()