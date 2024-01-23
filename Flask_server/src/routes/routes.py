from app import app

@app.route("/")
def index():
	return "Hello, World!"

@app.route("/test")
def test():
	import main
	return "This is a test."