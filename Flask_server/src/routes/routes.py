from app import app
# from flask import request
from flask_restful import Api, Resource
from src.operations.setup_server import setup
import json

@app.route("/")
def index():
	return "Hello World!"

api = Api(app)

class returnjson(Resource):
	def get(self, player_count, identifier):
		player_count = int(player_count)
		setup(player_count, identifier)
		data = json.load(open(f"templates/draft{identifier}.json"))
		return data

api.add_resource(returnjson, "/<player_count>/<identifier>")
