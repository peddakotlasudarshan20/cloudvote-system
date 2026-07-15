from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import db, User

auth = Blueprint("auth", __name__)

# ---------------------------------
# Register API
# ---------------------------------
@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        mobile=data["mobile"],
        voter_id=data["voter_id"],
        password=generate_password_hash(data["password"])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration Successful",
        "status": "Pending Admin Approval"
    })


# ---------------------------------
# Login API
# ---------------------------------
@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = User.query.filter_by(email=data["email"]).first()

    if user is None:
        return jsonify({
            "message": "User not found"
        }), 404

    if not check_password_hash(user.password, data["password"]):
        return jsonify({
            "message": "Invalid Password"
        }), 401

    if user.status != "Approved":
        return jsonify({
            "message": "Your account is awaiting administrator approval"
        }), 403

    return jsonify({
        "message": "Login Successful",
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email
    })


# ---------------------------------
# User Profile API
# ---------------------------------
@auth.route("/profile/<int:user_id>", methods=["GET"])
def profile(user_id):

    user = User.query.get(user_id)

    if user is None:
        return jsonify({
            "message": "User Not Found"
        }), 404

    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "mobile": user.mobile,
        "voter_id": user.voter_id,
        "status": user.status
    })


# ---------------------------------
# Update Profile API
# ---------------------------------
@auth.route("/update-profile/<int:user_id>", methods=["PUT"])
def update_profile(user_id):

    user = User.query.get(user_id)

    if user is None:
        return jsonify({
            "message": "User Not Found"
        }), 404

    data = request.get_json()

    user.full_name = data.get("full_name", user.full_name)
    user.email = data.get("email", user.email)
    user.mobile = data.get("mobile", user.mobile)

    db.session.commit()

    return jsonify({
        "message": "Profile Updated Successfully"
    })