import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    voter_id: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        formData
      );

      alert(response.data.message);
      window.location.href = "/login";

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <h2 className="text-center mb-4">CloudVote Registration</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Voter ID</label>
            <input
              type="text"
              name="voter_id"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;