

import image1 from "../assets/images/1.jpeg";
import image2 from "../assets/images/2.jpeg";
import image3 from "../assets/images/3.jpeg";
import image4 from "../assets/images/4.jpeg";
import image5 from "../assets/images/5.jpeg";
import image6 from "../assets/images/6.jpeg";
import image7 from "../assets/images/7.jpeg";
import image8 from "../assets/images/8.jpeg";
import image9 from "../assets/images/9.jpeg";
import image10 from "../assets/images/10.jpeg";
import image11 from "../assets/images/11.jpeg";
import image12 from "../assets/images/12.jpeg";
import image13 from "../assets/images/13.jpeg";


// =====================================================
// VELOOP REWARDS - 13 GAMES
// =====================================================

export const games = [
  {
    id: 1,
    name: "Reaction Game",
    slug: "reaction-game",
    description:
      "Tap the target as quickly as possible and earn coins.",
    reward: 20,
    image: image1,
    is_active: true,
  },

  {
    id: 2,
    name: "Memory Match",
    slug: "memory-match",
    description:
      "Match the correct pairs and test your memory.",
    reward: 20,
    image: image2,
    is_active: true,
  },

  {
    id: 3,
    name: "Number Rush",
    slug: "number-rush",
    description:
      "Solve number challenges quickly and earn rewards.",
    reward: 20,
    image: image3,
    is_active: true,
  },

  {
    id: 4,
    name: "Quick Tap",
    slug: "quick-tap",
    description:
      "Tap the targets quickly before the timer runs out.",
    reward: 20,
    image: image4,
    is_active: true,
  },

  {
    id: 5,
    name: "Color Match",
    slug: "color-match",
    description:
      "Find and match the correct colors to score points.",
    reward: 20,
    image: image5,
    is_active: true,
  },

  {
    id: 6,
    name: "Word Puzzle",
    slug: "word-puzzle",
    description:
      "Solve word puzzles and challenge your vocabulary.",
    reward: 20,
    image: image6,
    is_active: true,
  },

  {
    id: 7,
    name: "Bubble Pop",
    slug: "bubble-pop",
    description:
      "Pop as many bubbles as you can and collect coins.",
    reward: 20,
    image: image7,
    is_active: true,
  },

  {
    id: 8,
    name: "2048 Challenge",
    slug: "2048-challenge",
    description:
      "Combine matching numbers and reach the highest score.",
    reward: 20,
    image: image8,
    is_active: true,
  },

  {
    id: 9,
    name: "Speed Quiz",
    slug: "speed-quiz",
    description:
      "Answer questions quickly and earn Game Coins.",
    reward: 20,
    image: image9,
    is_active: true,
  },

  {
    id: 10,
    name: "Catch It",
    slug: "catch-it",
    description:
      "Catch the falling objects before they disappear.",
    reward: 20,
    image: image10,
    is_active: true,
  },

  {
    id: 11,
    name: "Block Puzzle",
    slug: "block-puzzle",
    description:
      "Place blocks correctly and complete the puzzle.",
    reward: 20,
    image: image11,
    is_active: true,
  },

  {
    id: 12,
    name: "Lucky Spin",
    slug: "lucky-spin",
    description:
      "Spin the wheel and try your luck to win coins.",
    reward: 20,
    image: image12,
    is_active: true,
  },

  {
    id: 13,
    name: "Treasure Hunt",
    slug: "treasure-hunt",
    description:
      "Find hidden treasures and collect exciting rewards.",
    reward: 20,
    image: image13,
    is_active: true,
  },
];


// =====================================================
// GET ACTIVE GAMES
// =====================================================

export function getGames() {
  return games.filter((game) => game.is_active);
}


// =====================================================
// GET GAME BY SLUG
// =====================================================

export function getGameBySlug(slug) {
  return games.find((game) => game.slug === slug);
}


// =====================================================
// GET GAME BY ID
// =====================================================

export function getGameById(id) {
  return games.find((game) => game.id === Number(id));
}


// Default export
export default games;