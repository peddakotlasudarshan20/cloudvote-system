from flask import Blueprint, request, jsonify
from models.user import db
from models.candidate import Candidate

# Blueprint
candidate = Blueprint("candidate", __name__)

# -----------------------------
# Add Candidate
# -----------------------------
@candidate.route("/add-candidate", methods=["POST"])
def add_candidate():

    data = request.get_json()

    new_candidate = Candidate(
        candidate_name=data["candidate_name"],
        party_name=data["party_name"],
        symbol=data["symbol"],
        election_id=data["election_id"]
    )

    db.session.add(new_candidate)
    db.session.commit()

    return jsonify({
        "message": "Candidate Added Successfully",
        "status": "Success"
    })


# -----------------------------
# View All Candidates
# -----------------------------
@candidate.route("/candidates", methods=["GET"])
def get_candidates():

    candidates = Candidate.query.all()

    candidate_list = []

    for c in candidates:
        candidate_list.append({
            "id": c.id,
            "candidate_name": c.candidate_name,
            "party_name": c.party_name,
            "symbol": c.symbol,
            "election_id": c.election_id,
            "status": c.status
        })

    return jsonify(candidate_list)


# -----------------------------
# View Single Candidate
# -----------------------------
@candidate.route("/candidate/<int:candidate_id>", methods=["GET"])
def get_candidate(candidate_id):

    c = Candidate.query.get(candidate_id)

    if c is None:
        return jsonify({
            "message": "Candidate Not Found"
        }), 404

    return jsonify({
        "id": c.id,
        "candidate_name": c.candidate_name,
        "party_name": c.party_name,
        "symbol": c.symbol,
        "election_id": c.election_id,
        "status": c.status
    })


# -----------------------------
# Update Candidate
# -----------------------------
@candidate.route("/update-candidate/<int:candidate_id>", methods=["PUT"])
def update_candidate(candidate_id):

    c = Candidate.query.get(candidate_id)

    if c is None:
        return jsonify({
            "message": "Candidate Not Found"
        }), 404

    data = request.get_json()

    c.candidate_name = data["candidate_name"]
    c.party_name = data["party_name"]
    c.symbol = data["symbol"]
    c.election_id = data["election_id"]

    db.session.commit()

    return jsonify({
        "message": "Candidate Updated Successfully"
    })


# -----------------------------
# Delete Candidate
# -----------------------------
@candidate.route("/delete-candidate/<int:candidate_id>", methods=["DELETE"])
def delete_candidate(candidate_id):

    c = Candidate.query.get(candidate_id)

    if c is None:
        return jsonify({
            "message": "Candidate Not Found"
        }), 404

    db.session.delete(c)
    db.session.commit()

    return jsonify({
        "message": "Candidate Deleted Successfully"
    })