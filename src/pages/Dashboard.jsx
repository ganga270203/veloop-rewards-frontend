import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Player";
  const email = localStorage.getItem("email") || "Not available";

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await api.get("scores/");
        setScores(response.data);
      } catch (err) {
        console.error("Score API error:", err);

        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        setError("Unable to load your statistics.");
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [navigate]);



  const totalCoins = scores.reduce(
    (total, game) => total + Number(game.coins || 0),
    0
  );

  const totalGamesPlayed = scores.length;

  const highestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map((game) => Number(game.score || 0))
        )
      : 0;



  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="dashboardPage">

      {/* =================================
          TOP HEADER
      ================================= */}

      <header className="dashboardHeader">

        <div
          className="dashboardLogo"
          onClick={() => navigate("/")}
        >
          <span className="logoV">V</span>
          <span className="logoText">
            ELOOP
            <small>REWARDS</small>
          </span>
        </div>

        <div className="headerActions">

          <div className="coinBalance">
            🪙 {totalCoins}
          </div>

          <div className="notification">
            🔔
          </div>

          <div className="headerAvatar">
            {username.charAt(0).toUpperCase()}
          </div>

        </div>

      </header>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <main className="dashboardContent">


        {/* =================================
            HERO
        ================================= */}

        <section className="heroCard">

          <div className="heroContent">

            <p className="heroLabel">
              🎮 PLAYER DASHBOARD
            </p>

            <h1>
              Play & <span>Earn</span>
            </h1>

            <p>
              Welcome back, <strong>{username}</strong>!
              <br />
              Play exciting games and earn rewards.
            </p>

            <button
              className="heroButton"
              onClick={() => navigate("/")}
            >
              🎮 Play Games
              <span>→</span>
            </button>

          </div>

          <div className="heroGraphic">
            🏆
          </div>

        </section>


        {/* =================================
            STATISTICS
        ================================= */}

        <section className="statsSection">

          <div className="sectionHeading">
            <div>
              <h2>Your Statistics</h2>
              <p>Your gaming progress</p>
            </div>

            <span className="viewAll">
              View All →
            </span>
          </div>


          {loading ? (

            <div className="loadingCard">
              <div className="spinner"></div>
              Loading statistics...
            </div>

          ) : (

            <div className="statsGrid">

              {/* COINS */}

              <div className="statCard gold">

                <div className="statIcon">
                  🪙
                </div>

                <div className="statInfo">
                  <span>Total Coins</span>
                  <strong>{totalCoins}</strong>
                  <small>Game Coins</small>
                </div>

              </div>


              {/* GAMES */}

              <div className="statCard purple">

                <div className="statIcon">
                  🎮
                </div>

                <div className="statInfo">
                  <span>Games Played</span>
                  <strong>{totalGamesPlayed}</strong>
                  <small>Total Games</small>
                </div>

              </div>


              {/* SCORE */}

              <div className="statCard blue">

                <div className="statIcon">
                  🏆
                </div>

                <div className="statInfo">
                  <span>Highest Score</span>
                  <strong>{highestScore}</strong>
                  <small>Personal Best</small>
                </div>

              </div>

            </div>

          )}


          {error && (
            <div className="dashboardError">
              ⚠️ {error}
            </div>
          )}

        </section>


        {/* =================================
            PROFILE / LEVEL
        ================================= */}

        <section className="progressCard">

          <div className="progressHeader">

            <div>
              <p>Your Progress</p>

              <h2>
                Level {Math.max(1, Math.floor(totalCoins / 100) + 1)}
              </h2>
            </div>

            <div className="levelBadge">
              ⭐
            </div>

          </div>


          <div className="progressNumbers">
            <span>
              {totalCoins} XP
            </span>

            <span>
              {Math.max(100, (Math.floor(totalCoins / 100) + 1) * 100)} XP
            </span>
          </div>


          <div className="progressBar">
            <div
              className="progressFill"
              style={{
                width: `${Math.min(
                  100,
                  totalCoins % 100
                )}%`,
              }}
            ></div>
          </div>


          <p className="progressText">
            Keep playing to unlock higher levels and rewards 🚀
          </p>

        </section>


        {/* =================================
            QUICK ACTIONS
        ================================= */}

        <section className="quickSection">

          <div className="sectionHeading">

            <div>
              <h2>Quick Actions</h2>
              <p>What do you want to do?</p>
            </div>

          </div>


          <div className="actionGrid">

            <button
              className="actionCard"
              onClick={() => navigate("/")}
            >

              <div className="actionIcon purpleIcon">
                🎮
              </div>

              <div>
                <h3>Play Games</h3>
                <p>Play & earn coins</p>
              </div>

              <span>→</span>

            </button>


            <button
              className="actionCard"
              onClick={() => navigate("/scores")}
            >

              <div className="actionIcon goldIcon">
                🏆
              </div>

              <div>
                <h3>My Scores</h3>
                <p>View game history</p>
              </div>

              <span>→</span>

            </button>


            <button className="actionCard">

              <div className="actionIcon greenIcon">
                🪙
              </div>

              <div>
                <h3>My Rewards</h3>
                <p>View earned coins</p>
              </div>

              <span>→</span>

            </button>

          </div>

        </section>


        {/* =================================
            PROFILE
        ================================= */}

        <section className="profileCard">

          <div className="profileAvatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="profileDetails">

            <span>PLAYER PROFILE</span>

            <h2>{username}</h2>

            <p>{email}</p>

          </div>

          <button
            className="profileButton"
            onClick={handleLogout}
          >
            Logout
          </button>

        </section>

      </main>


      {/* =================================
          MOBILE BOTTOM NAVIGATION
      ================================= */}

      <nav className="bottomNavigation">

        <button onClick={() => navigate("/")}>
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button onClick={() => navigate("/scores")}>
          <span>🏆</span>
          <small>Scores</small>
        </button>

        <button
          className="bottomPlay"
          onClick={() => navigate("/")}
        >
          <span>🎮</span>
          <small>Play</small>
        </button>

        <button>
          <span>🪙</span>
          <small>Wallet</small>
        </button>

        <button>
          <span>👤</span>
          <small>Profile</small>
        </button>

      </nav>

      {/* =================================
          FOOTER
================================= */}

<footer className="dashboardFooter">

  <div className="footerContainer">

    {/* BRAND */}
    <div className="footerBrand">

      <div className="footerLogo">
        <span className="footerLogoV">V</span>
        <span>
          ELOOP
          <small>REWARDS</small>
        </span>
      </div>

      <p>
        Play exciting games, earn coins
        and unlock amazing rewards.
      </p>

    </div>


    {/* QUICK LINKS */}
    <div className="footerLinks">

      <h3>Quick Links</h3>

      <button onClick={() => navigate("/")}>
        🎮 Play Games
      </button>

      <button onClick={() => navigate("/scores")}>
        🏆 My Scores
      </button>

      <button onClick={() => navigate("/dashboard")}>
        👤 Dashboard
      </button>

    </div>


    {/* SOCIAL MEDIA */}
    <div className="footerContact">
        <h3>Contact Us</h3>

          <a href="mailto:velooprewardsofficial@gmail.com">
           ✉️ velooprewardsofficial@gmail.com
            </a>
</div>

    <div className="footerSocial">

      <h3>Follow Us</h3>

      <p>Stay connected with VELOOP Rewards</p>

      <div className="socialIcons">

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="socialIcon instagram"
        >
          ◎
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="socialIcon facebook"
        >
          f
        </a>

        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="socialIcon youtube"
        >
          ▶
        </a>

        <a
          href="https://www.linkedin.com/company/veloop-rewards/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="socialIcon linkedin"
        >
          in
        </a>

        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="socialIcon twitter"
        >
          𝕏
        </a>

      </div>

    </div>

  </div>


  {/* BOTTOM FOOTER */}

  <div className="footerBottom">

    <p>
      © {new Date().getFullYear()} VELOOP Rewards.
      All rights reserved.
    </p>

    <div className="footerBottomLinks">
      <span>Privacy Policy</span>
      <span>Terms & Conditions</span>
      <span>Contact Us</span>
    </div>

  </div>

</footer>

    </div>
  );
}