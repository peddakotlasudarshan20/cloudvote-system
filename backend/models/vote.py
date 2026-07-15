from models.user import db

class Vote(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, nullable=False)

    candidate_id = db.Column(db.Integer, nullable=False)

    election_id = db.Column(db.Integer, nullable=False)

    voted_at = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<Vote {self.id}>"