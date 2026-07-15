from flask import Flask
from flask_cors import CORS
from models.user import db
from models.election import Election
from models.candidate import Candidate
from models.vote import Vote
from routes.auth import auth
from routes.admin import admin
from routes.election import election
from routes.candidate import candidate
from routes.vote import vote


app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()


app.register_blueprint(auth)
app.register_blueprint(admin)
app.register_blueprint(election)
app.register_blueprint(candidate)
app.register_blueprint(vote)

if __name__ == "__main__":
    app.run(debug=True)