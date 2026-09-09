import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";


export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleLogin(event) {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await api.post("login/", {
        username: username,
        password: password,
      });


      const {
        token,
        user_id,
        username: loggedUsername,
      } = response.data;


      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", loggedUsername);


      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.error ||
        "Invalid username or password."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="loginPage">

      <div className="loginCard">

        <div className="loginLogo">
          🎮
        </div>

        <h1>VELOOP REWARDS</h1>

        <p className="loginSubtitle">
          Login to Play & Earn
        </p>


        <form
          onSubmit={handleLogin}
          className="loginForm"
        >

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          {error && (
            <div className="loginError">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <p className="registerLink">
              Don't have an account?{" "}
              <Link to="/register">
                  Register
              </Link>
          </p> 

        </form>

      </div>

    </div>
  );
}