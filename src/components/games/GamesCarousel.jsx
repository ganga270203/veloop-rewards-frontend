import { useRef } from "react";
import { Link } from "react-router-dom";

import GameCard from "./GameCard";

import { games } from "../../data/gamesData";

import styles from "./GamesCarousel.module.css";


export default function GamesCarousel() {

  
  const activeGames = Array.isArray(games)
    ? games.filter((game) => game.is_active)
    : [];


  const carouselRef = useRef(null);


  // =====================================================
  // NEXT
  // =====================================================

  const scrollNext = () => {

    if (!carouselRef.current) {
      return;
    }

    carouselRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });

  };


  // =====================================================
  // PREVIOUS
  // =====================================================

  const scrollPrevious = () => {

    if (!carouselRef.current) {
      return;
    }

    carouselRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });

  };


  // =====================================================
  // NO GAMES
  // =====================================================

  if (activeGames.length === 0) {

    return (
      <section className={styles.section}>

        <div className={styles.emptyState}>

          <h2>
            No Games Available
          </h2>

          <p>
            Please check again later.
          </p>

        </div>

      </section>
    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <section className={styles.section}>

      {/* ================================================
          HEADER
      ================================================= */}

      <div className={styles.header}>

        <div>

          <span className={styles.eyebrow}>
            VELOOP REWARDS
          </span>


          <h2 className={styles.title}>
            Play Games
            <span> &amp; Earn Coins</span>
          </h2>


          <p className={styles.subtitle}>
            Choose your favorite game and start earning rewards.
          </p>

        </div>


        <Link
          to="/scores"
          className={styles.scoreButton}
        >
          My Scores
        </Link>

      </div>


      {/* ================================================
          CAROUSEL
      ================================================= */}

      <div className={styles.carouselWrapper}>


        {/* PREVIOUS BUTTON */}

        <button
          type="button"
          className={`${styles.arrow} ${styles.leftArrow}`}
          onClick={scrollPrevious}
          aria-label="Previous games"
        >
          ‹
        </button>


        {/* GAME CARDS */}

        <div
          ref={carouselRef}
          className={styles.carousel}
        >

          {activeGames.map((game) => (

            <GameCard
              key={game.id}
              game={game}
            />

          ))}

        </div>


        {/* NEXT BUTTON */}

        <button
          type="button"
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={scrollNext}
          aria-label="Next games"
        >
          ›
        </button>


      </div>


      {/* ================================================
          FOOTER
      ================================================= */}

      <div className={styles.bottomInfo}>

        <span>
          {activeGames.length} Games Available
        </span>


        <span>
          ← Scroll to explore →
        </span>

      </div>


    </section>

  );

}