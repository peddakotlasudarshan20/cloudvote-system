<<<<<<< HEAD
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

=======
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()
>>>>>>> origin/main

app = Flask(__name__)
CORS(app, origins="*")

<<<<<<< HEAD
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
=======
# ── MongoDB connection ──────────────────────────────────────────────────────
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB", "cloudvote")]

candidates_col = db["candidates"]
voters_col     = db["voters"]
election_col   = db["election"]

# Admin credentials from env (no DB needed)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


# ── Helpers ─────────────────────────────────────────────────────────────────
def serialize(doc):
    """Convert MongoDB doc to JSON-serializable dict."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc


# ── Health ───────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"status": "Backend is running!", "db": db.name})


# ── Candidates ───────────────────────────────────────────────────────────────
@app.route("/api/candidates", methods=["GET"])
def get_candidates():
    docs = list(candidates_col.find())
    return jsonify([serialize(d) for d in docs])


@app.route("/api/candidates", methods=["POST"])
def add_candidate():
    body = request.get_json()
    if not body or not body.get("name", "").strip():
        return jsonify({"error": "Candidate name is required."}), 400

    doc = {
        "name":        body.get("name", "").strip(),
        "symbol":      body.get("symbol", "—").strip() or "—",
        "party":       body.get("party", "").strip(),
        "partyLogo":   body.get("partyLogo", "").strip(),
        "bio":         body.get("bio", "").strip(),
        "photoUrl":    body.get("photoUrl", ""),
        "partyLogoUrl": body.get("partyLogoUrl", ""),
        "votes":       0,
    }
    result = candidates_col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return jsonify(doc), 201


@app.route("/api/candidates/<candidate_id>", methods=["DELETE"])
def delete_candidate(candidate_id):
    try:
        oid = ObjectId(candidate_id)
    except Exception:
        return jsonify({"error": "Invalid candidate id."}), 400
    candidates_col.delete_one({"_id": oid})
    return jsonify({"ok": True})


# ── Voters ───────────────────────────────────────────────────────────────────
@app.route("/api/voters", methods=["GET"])
def get_voters():
    docs = list(voters_col.find())
    return jsonify([serialize(d) for d in docs])


@app.route("/api/voters/register", methods=["POST"])
def register_voter():
    """Called after Supabase OTP verification to ensure voter exists in MongoDB."""
    body = request.get_json()
    email = (body.get("email") or "").strip().lower()
    name  = (body.get("name")  or "").strip()

    if not email:
        return jsonify({"error": "Email is required."}), 400

    existing = voters_col.find_one({"email": email})
    if existing:
        return jsonify(serialize(existing))   # already exists — return it

    doc = {
        "email":    email,
        "name":     name or email.split("@")[0],
        "hasVoted": False,
    }
    result = voters_col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return jsonify(doc), 201


@app.route("/api/voters/<email>", methods=["DELETE"])
def delete_voter(email):
    voters_col.delete_one({"email": email.lower()})
    return jsonify({"ok": True})


# ── Admin: manually add voter ────────────────────────────────────────────────
@app.route("/api/admin/voters", methods=["POST"])
def admin_add_voter():
    body  = request.get_json()
    email = (body.get("email") or "").strip().lower()
    name  = (body.get("name")  or "").strip()

    if not email:
        return jsonify({"error": "Email is required."}), 400
    if voters_col.find_one({"email": email}):
        return jsonify({"error": "This email is already registered."}), 409

    doc = {"email": email, "name": name or email.split("@")[0], "hasVoted": False}
    result = voters_col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return jsonify(doc), 201


# ── Votes ────────────────────────────────────────────────────────────────────
@app.route("/api/votes/cast", methods=["POST"])
def cast_vote():
    body         = request.get_json()
    email        = (body.get("email") or "").strip().lower()
    candidate_id = (body.get("candidateId") or "").strip()

    if not email or not candidate_id:
        return jsonify({"error": "email and candidateId are required."}), 400

    voter = voters_col.find_one({"email": email})
    if not voter:
        return jsonify({"error": "Voter not found. Please register first."}), 404
    if voter.get("hasVoted"):
        return jsonify({"error": "You have already voted. Each voter may vote only once."}), 409

    try:
        oid = ObjectId(candidate_id)
    except Exception:
        return jsonify({"error": "Invalid candidate id."}), 400

    candidate = candidates_col.find_one({"_id": oid})
    if not candidate:
        return jsonify({"error": "Candidate not found."}), 404

    # Atomic update
    candidates_col.update_one({"_id": oid}, {"$inc": {"votes": 1}})
    voters_col.update_one({"email": email}, {"$set": {"hasVoted": True}})

    return jsonify({"ok": True})


# ── Results ───────────────────────────────────────────────────────────────────
@app.route("/api/results", methods=["GET"])
def get_results():
    docs = list(candidates_col.find())
    return jsonify([serialize(d) for d in docs])


# ── Election schedule ─────────────────────────────────────────────────────────
@app.route("/api/election", methods=["GET"])
def get_election():
    doc = election_col.find_one({})
    if not doc:
        return jsonify({"date": "", "startTime": "", "endTime": ""})
    doc.pop("_id", None)
    return jsonify(doc)


@app.route("/api/election", methods=["POST"])
def set_election():
    body = request.get_json()
    election_col.delete_many({})   # only one schedule doc
    election_col.insert_one({
        "date":      body.get("date", ""),
        "startTime": body.get("startTime", ""),
        "endTime":   body.get("endTime", ""),
    })
    return jsonify({"ok": True})


# ── Admin login (credentials from .env) ──────────────────────────────────────
@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    body = request.get_json()
    if body.get("username") == ADMIN_USERNAME and body.get("password") == ADMIN_PASSWORD:
        return jsonify({"ok": True})
    return jsonify({"error": "Invalid admin credentials."}), 401

>>>>>>> origin/main

if __name__ == "__main__":
    app.run(debug=True, port=5000)