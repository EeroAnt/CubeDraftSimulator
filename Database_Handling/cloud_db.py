import psycopg2
from dotenv import load_dotenv
from os import getenv

load_dotenv()

cnx = psycopg2.connect(
	user="cubeadmin", 
	password=getenv("CLOUDDB-PASSWORD"), 
	host="cube-simulator-db.postgres.database.azure.com",
	port=5432, 
	database="cubedb")

cur_cloud = cnx.cursor()

cnx.close()