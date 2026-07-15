from flask import Blueprint, request, jsonify
from datetime import datetime

from models.user import db, User
from models.vote import Vote
from models.candidate import Candidate

vote = Blueprint("vote", __name__)

# ---------------------------------
# Cast Vote
# ---------------------------------
@vote.route("/vote", methods=["POST"])
def cast_vote():

    data = request.get_json()

    # Check User
    user = User.query.get(data["user_id"])

    if user is None:
        return jsonify({
            "message": "User not found"
        }), 404

    # Check Candidate
    candidate = Candidate.query.get(data["candidate_id"])

    if candidate is None:
        return jsonify({
            "message": "Candidate not found"
        }), 404

    # Check Election
    if candidate.election_id != data["election_id"]:
        return jsonify({
            "message": "Candidate does not belong to this election"
        }), 400

    # Check Duplicate Vote
    existing_vote = Vote.query.filter_by(
        user_id=data["user_id"],
        election_id=data["election_id"]
    ).first()

    if existing_vote:
        return jsonify({
            "message": "You have already voted in this election"
        }), 400

    # Save Vote
    new_vote = Vote(
        user_id=data["user_id"],
        candidate_id=data["candidate_id"],
        election_id=data["election_id"],
        voted_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    db.session.add(new_vote)
    db.session.commit()

    return jsonify({
        "message": "Vote Cast Successfully",
        "status": "Success"
    })


# ---------------------------------
# View All Votes
# ---------------------------------
@vote.route("/votes", methods=["GET"])
def get_votes():

    votes = Vote.query.all()

    vote_list = []

    for vote_data in votes:

        vote_list.append({
            "id": vote_data.id,
            "user_id": vote_data.user_id,
            "candidate_id": vote_data.candidate_id,
            "election_id": vote_data.election_id,
            "voted_at": vote_data.voted_at
        })

    return jsonify(vote_list)


# ---------------------------------
# Election Results
# ---------------------------------
@vote.route("/results", methods=["GET"])
def get_results():

    candidates = Candidate.query.all()

    results = []

    for candidate in candidates:

        total_votes = Vote.query.filter_by(candidate_id=candidate.id).count()

        results.append({
            "candidate_id": candidate.id,
            "candidate_name": candidate.candidate_name,
            "party_name": candidate.party_name,
            "symbol": candidate.symbol,
            "votes": total_votes
        })

    return jsonify(results)