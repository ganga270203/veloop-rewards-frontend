import { Link } from "react-router-dom";
import styles from "./GameCard.module.css";


export default function GameCard({ game }) {

  return (

    <Link
      to={`/games/${game.slug}`}
      className={styles.card}
    >

      <div className={styles.imageWrapper}>

        <img
          src={game.image}
          alt={game.name}
          className={styles.image}
        />

      </div>


      <div className={styles.content}>

        <h3>
          {game.name}
        </h3>


        <p>
          🪙 Earn {game.reward} Coins
        </p>


        <span className={styles.playButton}>
          Play Now →
        </span>

      </div>

    </Link>

  );

}