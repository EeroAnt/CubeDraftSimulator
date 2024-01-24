from flask import Flask
from os import getenv
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secet_key = getenv("SECRET_KEY")
app.config["DEBUG"] = True

import src.routes.routes
