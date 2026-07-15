from models.user import db

class Candidate(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    candidate_name = db.Column(db.String(100), nullable=False)

    party_name = db.Column(db.String(100), nullable=False)

    symbol = db.Column(db.String(100), nullable=False)

    election_id = db.Column(db.Integer, nullable=False)

    status = db.Column(db.String(20), default="Active")

    def __repr__(self):
        return f"<Candidate {self.candidate_name}>"