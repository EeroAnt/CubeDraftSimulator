from app import app
from flask import render_template
from flask_restful import Api, Resource
from src.operations.setup_server import setup
import json

@app.route("/")
def index():
	return render_template("index.html")

api = Api(app)

class returnjson(Resource):
	def get(self, player_count, identifier):
		if int(player_count) not in range(4, 10):
			return "Invalid player count", 400
		if len(identifier) > 10:
			return "Invalid identifier", 400
		player_count = int(player_count)
		setup(player_count, identifier)
		data = json.load(open(f"templates/draft{identifier}.json"))
		return data

api.add_resource(returnjson, "/<player_count>/<identifier>")
