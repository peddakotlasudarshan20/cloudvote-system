from flask_sqlalchemy import SQLAlchemy

from models.user import db

class Election(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    election_name = db.Column(db.String(100), nullable=False)

    description = db.Column(db.String(300))

    election_date = db.Column(db.String(20), nullable=False)

    start_time = db.Column(db.String(20))

    end_time = db.Column(db.String(20))

    status = db.Column(db.String(20), default="Upcoming")

    def __repr__(self):
        return f"<Election {self.election_name}>"