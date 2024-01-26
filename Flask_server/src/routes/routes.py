from app import app
from flask import render_template
from flask_restful import Api, Resource
from src.operations.setup_server import setup
from src.operations.error_handling.api_parameter_errors import api_parameter_errors
import json

@app.route("/")
def index():
	return render_template("index.html")

api = Api(app)

class returnjson(Resource):
	def get(self, player_count, identifier):
		if api_parameter_errors(identifier, player_count):
			return api_parameter_errors(identifier, player_count), 400
		player_count = int(player_count)
		setup(player_count, identifier)
		data = json.load(open(f"templates/draft{identifier}.json"))
		return data

api.add_resource(returnjson, "/<player_count>/<identifier>")
