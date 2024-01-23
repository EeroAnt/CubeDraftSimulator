from app import app
from flask import render_template, request
from src.operations.setup_server import setup
import json

@app.route("/")
def index():
	return "Hello, World!"

@app.route("/setup/<string:identifier>", methods=["GET"])
def test(identifier):
	if request.method == "GET":
		setup(4, identifier)
		data = json.load(open(f"templates/draft{identifier}.json"))
		return data
