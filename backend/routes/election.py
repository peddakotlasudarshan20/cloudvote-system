from flask import Blueprint, request, jsonify
from models.user import db
from models.election import Election

election = Blueprint("election", __name__)

# -----------------------------
# Create Election
# -----------------------------
@election.route("/create-election", methods=["POST"])
def create_election():

    data = request.get_json()

    new_election = Election(
        election_name=data["election_name"],
        description=data["description"],
        election_date=data["election_date"],
        start_time=data["start_time"],
        end_time=data["end_time"]
    )

    db.session.add(new_election)
    db.session.commit()

    return jsonify({
        "message": "Election Created Successfully",
        "status": "Success"
    })


# -----------------------------
# View All Elections
# -----------------------------
@election.route("/elections", methods=["GET"])
def get_elections():

    elections = Election.query.all()

    election_list = []

    for election_data in elections:
        election_list.append({
            "id": election_data.id,
            "election_name": election_data.election_name,
            "description": election_data.description,
            "election_date": election_data.election_date,
            "start_time": election_data.start_time,
            "end_time": election_data.end_time,
            "status": election_data.status
        })

    return jsonify(election_list)


# -----------------------------
# Get Single Election
# -----------------------------
@election.route("/election/<int:election_id>", methods=["GET"])
def get_election(election_id):

    election_data = Election.query.get(election_id)

    if election_data is None:
        return jsonify({
            "message": "Election not found"
        }), 404

    return jsonify({
        "id": election_data.id,
        "election_name": election_data.election_name,
        "description": election_data.description,
        "election_date": election_data.election_date,
        "start_time": election_data.start_time,
        "end_time": election_data.end_time,
        "status": election_data.status
    })


# -----------------------------
# Update Election
# -----------------------------
@election.route("/update-election/<int:election_id>", methods=["PUT"])
def update_election(election_id):

    election_data = Election.query.get(election_id)

    if election_data is None:
        return jsonify({
            "message": "Election not found"
        }), 404

    data = request.get_json()

    election_data.election_name = data["election_name"]
    election_data.description = data["description"]
    election_data.election_date = data["election_date"]
    election_data.start_time = data["start_time"]
    election_data.end_time = data["end_time"]

    db.session.commit()

    return jsonify({
        "message": "Election Updated Successfully"
    })


# -----------------------------
# Delete Election
# -----------------------------
@election.route("/delete-election/<int:election_id>", methods=["DELETE"])
def delete_election(election_id):

    election_data = Election.query.get(election_id)

    if election_data is None:
        return jsonify({
            "message": "Election not found"
        }), 404

    db.session.delete(election_data)
    db.session.commit()

    return jsonify({
        "message": "Election Deleted Successfully"
    })