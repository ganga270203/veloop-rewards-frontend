
import { useState } from "react";
import { ArrowLeft, BookOpen, Coins, Heart, Trophy } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { games } from "../data/gamesData";
import { useGameCoins } from "../context/GameCoinContext";
import GameHeader from "../components/games/GameHeader";
import ReactionGame from "../games/GameOne/ReactionGame";
import MemoryGame from "../games/GameTwo/MemoryGame";
import styles from "./GameHome.module.css";

export default function GameHome() {
  const { gameId } = useParams();

  return <GameContent key={gameId} gameId={gameId} />;
}

function GameContent({ gameId }) {
  const game = games.find((item) => String(item.id) === gameId);

  const { balance, spendCoins, addCoins } = useGameCoins();

  const [showGuide, setShowGuide] = useState(
    () => localStorage.getItem(`guide-${gameId}`) !== "seen"
  );

  const [started, setStarted] = useState(false);
  const [lastReward, setLastReward] = useState(0);
  const [message, setMessage] = useState("");

  if (!game) {
    return <div className={styles.missing}>Game not found.</div>;
  }

  const start = () => {
    if (balance < 20) {
      setMessage("Not enough Tokens. You need 20 Tokens to play.");
      return;
    }

    if (showGuide) return;

    spendCoins(20);
    setStarted(true);
    setMessage("");
  };

  const dismissGuide = () => {
    localStorage.setItem(`guide-${gameId}`, "seen");
    setShowGuide(false);
  };

  const finish = (reward) => {
    addCoins(reward);
    setLastReward(reward);
    setStarted(false);
    setMessage(
      `You earned ${reward} Game Coins. Your centralized balance is updated.`
    );
  };

  const revive = () => {
    setStarted(true);
    setMessage("Revived! Continue the challenge.");
  };

  return (
    <main className={styles.page}>
      <GameHeader title={game.name} />

      <section className={styles.shell}>
        <Link to="/" className={styles.back}>
          <ArrowLeft size={17} />
          Back to Games
        </Link>

        <div className={styles.top}>
          <div>
            <span className={styles.kicker}>20 TOKENS TO ENTER</span>

            <h1>{game.name}</h1>

            <p>
              {game.type === "reaction"
                ? "Test your reaction speed and hit the target before time runs out."
                : "Find matching pairs before the timer expires."}
            </p>
          </div>

          <div className={styles.coinBalance}>
            <Coins size={18} />
            {balance} Tokens
          </div>
        </div>

        {!started ? (
          <div className={styles.homeCard}>
            <img
              src={game.image}  
              alt={game.name}
              className={styles.gameArt}
              onError={(e) => {
                e.currentTarget.src =
                  "/public/assets/images/Placeholder.svg";
              }}
            />

            <div className={styles.homeBody}>
              <div className={styles.infoGrid}>
                <span>
                  <Trophy size={16} />
                  Earn Game Coins
                </span>

                <span>
                  <BookOpen size={16} />
                  Game Guide included
                </span>

                <span>
                  <Heart size={16} />
                  Revive supported
                </span>
              </div>

              {message && (
                <div className={styles.notice}>
                  {message}
                </div>
              )}

              {lastReward > 0 && (
                <div className={styles.success}>
                  +{lastReward} Game Coins added to your central balance.
                </div>
              )}

              <button className={styles.play} onClick={start}>PLAY NOW · 20 TOKENS</button>

              {balance < 20 && (
                <Link to="/" className={styles.earn}>
                  Earn more Tokens
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.gameStage}>
            {game.type === "reaction" ? (
              <ReactionGame
                onFinish={finish}
                onRevive={revive}
              />
            ) : (
              <MemoryGame
                onFinish={finish}
                onRevive={revive}
              />
            )}
          </div>
        )}

        <nav className={styles.bottomNav}>
          <Link to="/">
            <ArrowLeft size={16} />
            Home
          </Link>

          <Link to="/redeem">
            <Coins size={16} />
            Redeem
          </Link>
        </nav>
      </section>

      {showGuide && !started && (
        <div className={styles.overlay}>
          <div className={styles.guide}>
            <BookOpen size={24} />

            <h2>How to Play</h2>

            {game.type === "reaction" ? (
              <ul>
                <li>Wait for the target to appear.</li>
                <li>Tap it as quickly as possible.</li>
                <li>Score more points for faster reactions.</li>
                <li>You have 30 seconds.</li>
              </ul>
            ) : (
              <ul>
                <li>Tap cards to reveal them.</li>
                <li>Find all matching pairs.</li>
                <li>Finish with as few moves as possible.</li>
                <li>You have 60 seconds.</li>
              </ul>
            )}

            <button onClick={dismissGuide}>
              GOT IT
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

