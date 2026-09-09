import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css";

export default function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleRegister(event) {

    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      const response = await api.post("register/", {
        username,
        email,
        password,
      });

      const {
        token,
        user_id,
        username: registeredUsername,
        email: registeredEmail,
      } = response.data;


      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", registeredUsername);
      localStorage.setItem("email", registeredEmail);


      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.error ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="registerPage">

      <div className="registerCard">

        <div className="registerLogo">
          🎮
        </div>

        <h1>VELOOP REWARDS</h1>

        <p className="registerSubtitle">
          Create your account
        </p>


        <form
          className="registerForm"
          onSubmit={handleRegister}
        >

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />


          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />


          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />


          {error && (
            <div className="registerError">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>

        </form>


        <p className="loginLink">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}