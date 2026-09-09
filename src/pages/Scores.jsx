import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Scores.css";

export default function Scores() {
  const navigate = useNavigate();

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await api.get("scores/");
        setScores(response.data);
      } catch (err) {
        console.error("Scores error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("username");

          navigate("/login");
          return;
        }

        setError("Unable to load your scores.");
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [navigate]);

  /* ================= STATS ================= */

  const totalCoins = scores.reduce(
    (total, game) => total + Number(game.coins || 0),
    0
  );

  const totalGamesPlayed = scores.length;

  const highestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map((game) =>
            Number(game.score || 0)
          )
        )
      : 0;

  if (loading) {
    return (
      <div className="scores-loading">
        Loading your scores...
      </div>
    );
  }

  return (
    <main className="scores-page">

      {/* ================= HEADER ================= */}

      <div className="scores-header">

        <div className="scores-header-left">
          <h1>🏆 My Scores</h1>

          <p>
            Track your games, scores and earned coins.
          </p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="scores-error">
          {error}
        </div>
      )}


      {/* ================= STATS ================= */}

      <div className="scores-stats">

        <div className="score-stat-card">
          <span>Total Coins</span>

          <strong className="coins-value">
            🪙 {totalCoins}
          </strong>
        </div>


        <div className="score-stat-card">
          <span>Games Played</span>

          <strong className="games-value">
            🎮 {totalGamesPlayed}
          </strong>
        </div>


        <div className="score-stat-card">
          <span>Highest Score</span>

          <strong className="highest-value">
            🏆 {highestScore}
          </strong>
        </div>

      </div>


      {/* ================= SCORES ================= */}

      <div className="scores-container">

        <div className="scores-title">
          <h2>Game History</h2>
        </div>


        {scores.length === 0 ? (

          <div className="empty-scores">

            <div className="empty-scores-icon">
              🎮
            </div>

            <h3>
              No Games Played Yet
            </h3>

            <p>
              Play a game to see your scores here.
            </p>

          </div>

        ) : (

          <div className="scores-table-wrapper">

            <table className="scores-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Game</th>
                  <th>Score</th>
                  <th>Coins</th>
                  <th>Played At</th>
                </tr>
              </thead>


              <tbody>

                {scores.map((item, index) => (

                  <tr key={item.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td className="game-name">
                      {item.game_name ||
                        `Game #${item.game}`}
                    </td>

                    <td className="score-number">
                      {item.score}
                    </td>

                    <td className="coin-number">
                      🪙 {item.coins}
                    </td>

                    <td>
                      {item.played_at
                        ? new Date(
                            item.played_at
                          ).toLocaleString()
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}