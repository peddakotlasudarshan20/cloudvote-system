from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    mobile = db.Column(db.String(15), unique=True, nullable=False)

    voter_id = db.Column(db.String(30), unique=True, nullable=False)

    password = db.Column(db.String(200), nullable=False)

    status = db.Column(db.String(20), default="Pending")

    email_verified = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<User {self.full_name}>"