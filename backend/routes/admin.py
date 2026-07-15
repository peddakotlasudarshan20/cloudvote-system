from flask import Blueprint, jsonify
from models.user import db, User
from models.election import Election
from models.candidate import Candidate
from models.vote import Vote

admin = Blueprint("admin", __name__)

# -------------------------------
# View All Users
# -------------------------------
@admin.route("/users", methods=["GET"])
def get_users():

    users = User.query.all()

    user_list = []

    for user in users:
        user_list.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "mobile": user.mobile,
            "voter_id": user.voter_id,
            "status": user.status
        })

    return jsonify(user_list)


# -------------------------------
# Approve User
# -------------------------------
@admin.route("/approve-user/<int:user_id>", methods=["GET"])
def approve_user(user_id):

    user = User.query.get(user_id)

    if user is None:
        return jsonify({
            "message": "User Not Found"
        }), 404

    user.status = "Approved"

    db.session.commit()

    return jsonify({
        "message": "User Approved Successfully"
    })


# -------------------------------
# Dashboard
# -------------------------------
@admin.route("/dashboard", methods=["GET"])
def dashboard():

    total_users = User.query.count()
    total_elections = Election.query.count()
    total_candidates = Candidate.query.count()
    total_votes = Vote.query.count()

    return jsonify({
        "total_users": total_users,
        "total_elections": total_elections,
        "total_candidates": total_candidates,
        "total_votes": total_votes
    })