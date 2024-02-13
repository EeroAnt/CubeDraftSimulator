from app import app
from flask import render_template, request
from flask_restful import Api, Resource
from src.operations.setup_server import setup
from src.operations.error_handling.api_parameter_errors import api_parameter_errors
from src.operations.database.send_draft_data import send_draft_data
import json

@app.route("/")
def index():
	print("index")
	return render_template("index.html")

@app.route("/draftdata", methods=["POST", "GET"])
def parse_draftdata():
	data = request.get_json()
	send_draft_data(data)
	return "success"

api = Api(app)

class returnjson(Resource):
	def get(self, player_count, identifier):
		if api_parameter_errors(identifier, player_count):
			return api_parameter_errors(identifier, player_count), 400
		player_count = int(player_count)
		# data = json.dumps({"hello": "world"})
		setup(player_count, identifier)
		data = json.load(open(f"templates/draft{identifier}.json"))
		return data

api.add_resource(returnjson, "/<player_count>/<identifier>")
