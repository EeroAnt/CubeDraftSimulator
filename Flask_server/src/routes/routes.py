from app import app
from flask import render_template, request
from flask_restful import Api, Resource
from src.operations.setup_server import setup
from src.operations.error_handling.api_parameter_errors import api_parameter_errors
from src.operations.database.send_draft_data import send_draft_data
from math import ceil
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
	def get(self, player_count, identifier, commander_packs_included=True, normal_rounds=8, multi_ratio=3, generic_ratio=2, colorless_ratio=3, land_ratio=2):
		if api_parameter_errors(identifier, player_count):
			return api_parameter_errors(identifier, player_count), 400
		
		specs = {
		"player_count": int(player_count),
		"commander_packs": bool(int(commander_packs_included)),
		"normal_rounds": int(normal_rounds),
		"multi_ratio": int(multi_ratio),
		"generic_ratio": int(generic_ratio),
		"colorless_ratio": int(colorless_ratio),
		"land_ratio": int(land_ratio),
		"uncut_pack_size": int(multi_ratio) + int(generic_ratio)*5 + int(colorless_ratio) + int(land_ratio)
		}
		specs["number_of_structured_packs"] = ceil(15*specs["normal_rounds"]*specs["player_count"]/specs["uncut_pack_size"])
		
		setup(specs, identifier)
		data = json.load(open(f"templates/draft{identifier}.json"))
		return data

api.add_resource(returnjson, "/<player_count>/<identifier>/<commander_packs_included>/<normal_rounds>/<multi_ratio>/<generic_ratio>/<colorless_ratio>/<land_ratio>")
