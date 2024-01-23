from app import app
from flask import render_template
from src.operations.setup_server import setup

@app.route("/")
def index():
	return "Hello, World!"

@app.route("/setup")
def test():
	setup(4)
	return render_template("drafttest.json")