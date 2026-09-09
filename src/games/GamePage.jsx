import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { getGameBySlug } from "../data/gamesData";
import "./GamePage.css";

/* =========================================================
   HELPERS
========================================================= */

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);


/* =========================================================
   COMMON GAME HEADER
========================================================= */

function GameTopBar({ onBack }) {
  const [coins, setCoins] = useState(
    Number(localStorage.getItem("coins") || 0)
  );

  useEffect(() => {
    const updateCoins = () => {
      setCoins(Number(localStorage.getItem("coins") || 0));
    };

    window.addEventListener("storage", updateCoins);

    return () => {
      window.removeEventListener("storage", updateCoins);
    };
  }, []);

  return (
    <div className="game-topbar">

      <button
        className="game-back-btn"
        onClick={onBack}
      >
        ← Back to Games
      </button>

      <div className="game-brand">
        VELOOP
      </div>

      <div className="game-coins">
        🪙 {coins}
      </div>

    </div>
  );
}


/* =========================================================
   GAME 1 - REACTION RUSH
========================================================= */

function ReactionRush({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  const moveTarget = () => {
    setPosition({
      x: randomInt(10, 85),
      y: randomInt(10, 85),
    });

    setScore((prev) => prev + 10);
  };

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, onFinish, score]);

  return (
    <div className="mini-game reaction-game">

      {!started ? (
        <div className="start-screen">
          <div className="big-game-icon">⚡</div>

          <h2>Reaction Rush</h2>

          <p>
            Tap the target as quickly as possible.
          </p>

          <button
            className="primary-game-btn"
            onClick={() => setStarted(true)}
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <GameStats
            score={score}
            time={time}
          />

          <div className="reaction-board">

            <button
              className="reaction-target"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={moveTarget}
            >
              🎯
            </button>

          </div>
        </>
      )}

    </div>
  );
}


/* =========================================================
   GAME 2 - MEMORY FLIP
========================================================= */

function MemoryFlip({ onFinish }) {
  const values = useMemo(
    () =>
      shuffle([
        "🍎",
        "🍎",
        "🚀",
        "🚀",
        "⭐",
        "⭐",
        "🎮",
        "🎮",
      ]),
    []
  );

  const [cards, setCards] = useState(
    values.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }))
  );

  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (selected.length !== 2) return;

    const [first, second] = selected;

    setMoves((prev) => prev + 1);

    const timer = setTimeout(() => {
      setCards((prev) =>
        prev.map((card) => {
          if (card.id === first || card.id === second) {
            return {
              ...card,
              flipped: false,
            };
          }

          return card;
        })
      );

      setSelected([]);
    }, 650);

    if (cards[first]?.value === cards[second]?.value) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === first || card.id === second
            ? {
                ...card,
                matched: true,
                flipped: true,
              }
            : card
        )
      );

      clearTimeout(timer);
      setSelected([]);
    }

    return () => clearTimeout(timer);
  }, [selected, cards]);

  useEffect(() => {
    const complete = cards.every((card) => card.matched);

    if (complete) {
      const score = Math.max(20, 200 - moves * 15);
      onFinish(score);
    }
  }, [cards, moves, onFinish]);

  const flipCard = (id) => {
    if (selected.length >= 2) return;

    const card = cards.find((item) => item.id === id);

    if (!card || card.flipped || card.matched) return;

    setCards((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              flipped: true,
            }
          : item
      )
    );

    setSelected((prev) => [...prev, id]);
  };

  return (
    <div className="mini-game">

      <div className="game-title-small">
        🧠 Memory Flip
      </div>

      <p className="game-description">
        Find all matching pairs.
      </p>

      <div className="memory-grid">

        {cards.map((card) => (
          <button
            key={card.id}
            className={`memory-card ${
              card.flipped || card.matched ? "flipped" : ""
            }`}
            onClick={() => flipCard(card.id)}
          >
            {card.flipped || card.matched
              ? card.value
              : "?"}
          </button>
        ))}

      </div>

      <div className="small-score">
        Moves: <strong>{moves}</strong>
      </div>

    </div>
  );
}


/* =========================================================
   GAME 3 - NUMBER HUNT
========================================================= */

function NumberHunt({ onFinish }) {
  const numbers = useMemo(
    () => shuffle(Array.from({ length: 16 }, (_, i) => i + 1)),
    []
  );

  const [next, setNext] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  const clickNumber = (number) => {
    if (number !== next) return;

    setScore((prev) => prev + 10);

    if (number === 16) {
      onFinish(score + 10);
      return;
    }

    setNext((prev) => prev + 1);
  };

  if (!started) {
    return (
      <StartScreen
        icon="🔢"
        title="Number Hunt"
        description="Find numbers from 1 to 16 as quickly as possible."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div className="number-grid">

        {numbers.map((number) => (
          <button
            key={number}
            className={`number-button ${
              number < next ? "number-used" : ""
            }`}
            disabled={number < next}
            onClick={() => clickNumber(number)}
          >
            {number}
          </button>
        ))}

      </div>

      <div className="target-message">
        Find: <strong>{next}</strong>
      </div>

    </div>
  );
}


/* =========================================================
   GAME 4 - TARGET SHOOTER
========================================================= */

function TargetShooter({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [target, setTarget] = useState({
    x: 50,
    y: 50,
  });

  const moveTarget = useCallback(() => {
    setTarget({
      x: randomInt(10, 85),
      y: randomInt(10, 85),
    });
  }, []);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(moveTarget, 800);

    return () => clearInterval(interval);
  }, [started, moveTarget]);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  if (!started) {
    return (
      <StartScreen
        icon="🎯"
        title="Target Shooter"
        description="Hit as many moving targets as possible."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div className="target-board">

        <button
          className="shoot-target"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
          }}
          onClick={() => setScore((prev) => prev + 15)}
        >
          🎯
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   GAME 5 - COLOR CLASH
========================================================= */

function ColorClash({ onFinish }) {
  const colors = [
    {
      name: "RED",
      value: "#ef4444",
    },
    {
      name: "BLUE",
      value: "#3b82f6",
    },
    {
      name: "GREEN",
      value: "#22c55e",
    },
    {
      name: "YELLOW",
      value: "#eab308",
    },
  ];

  const createQuestion = () => {
    const text = colors[randomInt(0, colors.length - 1)];
    const actual = colors[randomInt(0, colors.length - 1)];

    return {
      text: text.name,
      actual: actual.name,
      color: actual.value,
    };
  };

  const [question, setQuestion] = useState(createQuestion);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  const answer = (name) => {
    if (name === question.actual) {
      setScore((prev) => prev + 20);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }

    setQuestion(createQuestion());
  };

  if (!started) {
    return (
      <StartScreen
        icon="🌈"
        title="Color Clash"
        description="Choose the color of the word, not the word itself."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div
        className="color-word"
        style={{
          color: question.color,
        }}
      >
        {question.text}
      </div>

      <div className="color-buttons">

        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => answer(color.name)}
            className="color-choice"
            style={{
              background: color.value,
            }}
          >
            {color.name}
          </button>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   GAME 6 - WORD SCRAMBLE
========================================================= */

function WordScramble({ onFinish }) {
  const words = [
    "PYTHON",
    "REACT",
    "GAMES",
    "COINS",
    "REWARD",
    "CODING",
    "VELOOP",
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [started, setStarted] = useState(false);

  const makeScramble = useCallback((word) => {
    let result = shuffle(word.split("")).join("");

    if (result === word) {
      result = word
        .split("")
        .reverse()
        .join("");
    }

    return result;
  }, []);

  useEffect(() => {
    if (started) {
      setScrambled(makeScramble(words[0]));
    }
  }, [started, makeScramble]);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  const submitAnswer = (event) => {
    event.preventDefault();

    const correct = words[wordIndex];

    if (answer.trim().toUpperCase() === correct) {
      const newScore = score + 30;

      setScore(newScore);
      setAnswer("");

      if (wordIndex === words.length - 1) {
        onFinish(newScore);
        return;
      }

      const nextIndex = wordIndex + 1;

      setWordIndex(nextIndex);
      setScrambled(makeScramble(words[nextIndex]));
    } else {
      setAnswer("");
    }
  };

  if (!started) {
    return (
      <StartScreen
        icon="🔤"
        title="Word Scramble"
        description="Unscramble the letters and solve the word."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div className="scramble-word">
        {scrambled}
      </div>

      <form
        className="answer-form"
        onSubmit={submitAnswer}
      >
        <input
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          placeholder="Type your answer"
          autoFocus
        />

        <button className="primary-game-btn">
          Submit
        </button>
      </form>

      <p className="round-info">
        Word {wordIndex + 1} / {words.length}
      </p>

    </div>
  );
}


/* =========================================================
   GAME 7 - BUBBLE BLAST
========================================================= */

function BubbleBlast({ onFinish }) {
  const createBubbles = () =>
    Array.from({ length: 12 }, (_, index) => ({
      id: index,
      x: randomInt(5, 88),
      y: randomInt(5, 85),
      size: randomInt(40, 70),
    }));

  const [bubbles, setBubbles] = useState(createBubbles);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setBubbles(createBubbles());
    }, 2500);

    return () => clearInterval(interval);
  }, [started]);

  const popBubble = (id) => {
    setBubbles((prev) =>
      prev.filter((bubble) => bubble.id !== id)
    );

    setScore((prev) => prev + 10);
  };

  if (!started) {
    return (
      <StartScreen
        icon="🫧"
        title="Bubble Blast"
        description="Pop as many bubbles as you can before time runs out."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div className="bubble-board">

        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            className="bubble"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            onClick={() => popBubble(bubble.id)}
          >
            +
          </button>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   GAME 8 - 2048 MINI
========================================================= */

function Mini2048({ onFinish }) {
  const emptyBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const addTile = (board) => {
    const empty = [];

    board.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value === 0) {
          empty.push([r, c]);
        }
      });
    });

    if (empty.length === 0) {
      return board;
    }

    const [r, c] =
      empty[randomInt(0, empty.length - 1)];

    const newBoard = board.map((row) => [...row]);

    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;

    return newBoard;
  };

  const initialBoard = useMemo(() => {
    let board = emptyBoard.map((row) => [...row]);
    board = addTile(board);
    board = addTile(board);
    return board;
  }, []);

  const [board, setBoard] = useState(initialBoard);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const moveLeft = (current) => {
    let gained = 0;

    const result = current.map((row) => {
      const values = row.filter(Boolean);
      const newRow = [];

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          const merged = values[i] * 2;
          newRow.push(merged);
          gained += merged;
          i++;
        } else {
          newRow.push(values[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow;
    });

    return {
      board: result,
      gained,
    };
  };

  const rotate = (current) =>
    current[0].map((_, index) =>
      current.map((row) => row[index]).reverse()
    );

  const move = (direction) => {
    let current = board.map((row) => [...row]);

    if (direction === "up") {
      current = rotate(current);
    }

    if (direction === "right") {
      current = current.map((row) => [...row].reverse());
    }

    if (direction === "down") {
      current = rotate(rotate(rotate(current)));
    }

    const result = moveLeft(current);

    let next = result.board;

    if (direction === "up") {
      next = rotate(rotate(rotate(next)));
    }

    if (direction === "right") {
      next = next.map((row) => [...row].reverse());
    }

    if (direction === "down") {
      next = rotate(next);
    }

    const changed =
      JSON.stringify(next) !== JSON.stringify(board);

    if (!changed) return;

    const finalBoard = addTile(next);

    setBoard(finalBoard);
    setScore((prev) => prev + result.gained);

    const reached2048 = finalBoard.some((row) =>
      row.some((value) => value >= 2048)
    );

    if (reached2048) {
      onFinish(score + result.gained + 500);
    }
  };

  useEffect(() => {
    if (!started) return;

    const handleKey = (event) => {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
          event.key
        )
      ) {
        event.preventDefault();

        move(
          event.key
            .replace("Arrow", "")
            .toLowerCase()
        );
      }
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  });

  if (!started) {
    return (
      <StartScreen
        icon="🔢"
        title="2048 Mini"
        description="Combine matching numbers and reach the highest tile."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <div className="small-score">
        Score: <strong>{score}</strong>
      </div>

      <div className="game-2048">

        {board.flat().map((value, index) => (
          <div
            key={index}
            className={`tile tile-${value}`}
          >
            {value || ""}
          </div>
        ))}

      </div>

      <div className="direction-buttons">

        <button onClick={() => move("up")}>
          ↑
        </button>

        <div>
          <button onClick={() => move("left")}>
            ←
          </button>

          <button onClick={() => move("down")}>
            ↓
          </button>

          <button onClick={() => move("right")}>
            →
          </button>
        </div>

      </div>

      <p className="game-description">
        Use keyboard arrows or buttons.
      </p>

    </div>
  );
}


/* =========================================================
   GAME 9 - SPEED QUIZ
========================================================= */

function SpeedQuiz({ onFinish }) {
  const questions = [
    {
      question: "Which language is used with React?",
      options: ["Python", "JavaScript", "SQL", "PHP"],
      answer: "JavaScript",
    },
    {
      question: "What does CSS control?",
      options: [
        "Database",
        "Styling",
        "Server",
        "Password",
      ],
      answer: "Styling",
    },
    {
      question: "What is 12 × 5?",
      options: ["50", "55", "60", "65"],
      answer: "60",
    },
    {
      question: "Which is a database?",
      options: ["MySQL", "HTML", "CSS", "React"],
      answer: "MySQL",
    },
    {
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Application Program Internet",
        "Advanced Python Interface",
        "Applied Program Input",
      ],
      answer: "Application Programming Interface",
    },
  ];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  const answerQuestion = (answer) => {
    const correct =
      answer === questions[index].answer;

    const newScore = correct
      ? score + 30
      : score;

    setScore(newScore);

    if (index === questions.length - 1) {
      onFinish(newScore);
      return;
    }

    setIndex((prev) => prev + 1);
  };

  if (!started) {
    return (
      <StartScreen
        icon="❓"
        title="Speed Quiz"
        description="Answer five questions before time runs out."
        onStart={() => setStarted(true)}
      />
    );
  }

  const current = questions[index];

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div className="quiz-progress">
        Question {index + 1} / {questions.length}
      </div>

      <div className="quiz-question">
        {current.question}
      </div>

      <div className="quiz-options">

        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => answerQuestion(option)}
          >
            {option}
          </button>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   GAME 10 - COIN CATCHER
========================================================= */

function CoinCatcher({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState(45);
  const [falling, setFalling] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);

  useEffect(() => {
    if (!started) return;

    const spawn = setInterval(() => {
      setFalling((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: randomInt(5, 90),
          y: 0,
        },
      ]);
    }, 700);

    return () => clearInterval(spawn);
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const fall = setInterval(() => {
      setFalling((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + 7,
          }))
          .filter((item) => item.y < 100)
      );
    }, 200);

    return () => clearInterval(fall);
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, score, onFinish]);

  useEffect(() => {
    const caught = falling.filter(
      (item) =>
        item.y >= 82 &&
        Math.abs(item.x - player) < 12
    );

    if (caught.length > 0) {
      setScore((prev) => prev + caught.length * 15);

      const ids = new Set(
        caught.map((item) => item.id)
      );

      setFalling((prev) =>
        prev.filter((item) => !ids.has(item.id))
      );
    }
  }, [falling, player]);

  const move = (amount) => {
    setPlayer((prev) =>
      Math.max(5, Math.min(85, prev + amount))
    );
  };

  if (!started) {
    return (
      <StartScreen
        icon="🪙"
        title="Coin Catcher"
        description="Move the basket and catch falling coins."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <GameStats
        score={score}
        time={time}
      />

      <div className="catch-board">

        {falling.map((item) => (
          <div
            key={item.id}
            className="falling-coin"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            🪙
          </div>
        ))}

        <div
          className="catch-basket"
          style={{
            left: `${player}%`,
          }}
        >
          🧺
        </div>

      </div>

      <div className="movement-buttons">

        <button onClick={() => move(-10)}>
          ←
        </button>

        <button onClick={() => move(10)}>
          →
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   GAME 11 - BLOCK STACK
========================================================= */

function BlockStack({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [position, setPosition] = useState(20);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let next = prev + direction * 2;

        if (next >= 80 || next <= 5) {
          setDirection((d) => -d);
          next = prev;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [started, direction]);

  const placeBlock = () => {
    const newScore = score + 20;

    setBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: position,
      },
    ]);

    setScore(newScore);

    if (blocks.length >= 9) {
      onFinish(newScore);
    }
  };

  if (!started) {
    return (
      <StartScreen
        icon="🧱"
        title="Block Stack"
        description="Stop the moving block and build the tallest tower."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game">

      <div className="small-score">
        Height: <strong>{blocks.length}</strong>
      </div>

      <div className="stack-board">

        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="stack-block placed"
            style={{
              left: `${block.x}%`,
              bottom: `${index * 30}px`,
            }}
          />
        ))}

        <div
          className="stack-block moving"
          style={{
            left: `${position}%`,
            bottom: `${blocks.length * 30}px`,
          }}
        />

      </div>

      <button
        className="primary-game-btn"
        onClick={placeBlock}
      >
        Place Block
      </button>

    </div>
  );
}


/* =========================================================
   GAME 12 - LUCKY WHEEL
========================================================= */

function LuckyWheel({ onFinish }) {
  const rewards = [
    5,
    10,
    15,
    20,
    25,
    30,
    50,
    100,
  ];

  const [started, setStarted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);

    const index = randomInt(
      0,
      rewards.length - 1
    );

    const reward = rewards[index];

    const extraRotation =
      360 * 5 +
      index * (360 / rewards.length);

    setRotation((prev) => prev + extraRotation);

    setTimeout(() => {
      setResult(reward);
      setSpinning(false);

      onFinish(reward * 5);
    }, 3500);
  };

  if (!started) {
    return (
      <StartScreen
        icon="🎡"
        title="Lucky Wheel"
        description="Spin the wheel and test your luck."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="mini-game wheel-game">

      <div
        className={`lucky-wheel ${
          spinning ? "spinning" : ""
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {rewards.map((reward, index) => (
          <div
            key={reward}
            className="wheel-segment"
            style={{
              transform: `rotate(${
                index * (360 / rewards.length)
              }deg)`,
            }}
          >
            🪙 {reward}
          </div>
        ))}
      </div>

      <div className="wheel-pointer">
        ▼
      </div>

      <button
        className="primary-game-btn"
        disabled={spinning}
        onClick={spin}
      >
        {spinning ? "Spinning..." : "SPIN"}
      </button>

      {result !== null && (
        <div className="wheel-result">
          🎉 You won <strong>{result} Coins!</strong>
        </div>
      )}

    </div>
  );
}


/* =========================================================
   GAME 13 - TREASURE HUNT
========================================================= */

function TreasureHunt({ onFinish }) {
  const treasures = useMemo(
    () =>
      shuffle(
        Array.from({ length: 9 }, (_, i) => i)
      ).slice(0, 3),
    []
  );

  const [opened, setOpened] = useState([]);
  const [score, setScore] = useState(0);

  const openChest = (index) => {
    if (opened.includes(index)) return;

    const isTreasure = treasures.includes(index);

    const newScore = isTreasure
      ? score + 50
      : score;

    setScore(newScore);

    setOpened((prev) => [
      ...prev,
      index,
    ]);

    if (
      isTreasure &&
      treasures.every((item) =>
        [...opened, index].includes(item)
      )
    ) {
      onFinish(newScore);
    }

    if (
      [...opened, index].length >= 6
    ) {
      onFinish(newScore);
    }
  };

  return (
    <div className="mini-game">

      <div className="game-title-small">
        💎 Treasure Hunt
      </div>

      <p className="game-description">
        Find the hidden treasures.
      </p>

      <div className="treasure-score">
        Score: <strong>{score}</strong>
      </div>

      <div className="treasure-grid">

        {Array.from({ length: 9 }, (_, index) => {

          const openedCard =
            opened.includes(index);

          const treasure =
            treasures.includes(index);

          return (
            <button
              key={index}
              className={`treasure-box ${
                openedCard ? "opened" : ""
              }`}
              onClick={() => openChest(index)}
              disabled={openedCard}
            >
              {openedCard
                ? treasure
                  ? "💎"
                  : "💨"
                : "📦"}
            </button>
          );
        })}

      </div>

      <p className="game-description">
        Choose wisely. You have limited attempts.
      </p>

    </div>
  );
}


/* =========================================================
   COMMON COMPONENTS
========================================================= */

function StartScreen({
  icon,
  title,
  description,
  onStart,
}) {
  return (
    <div className="start-screen">

      <div className="big-game-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <button
        className="primary-game-btn"
        onClick={onStart}
      >
        Start Game
      </button>

    </div>
  );
}


function GameStats({ score, time }) {
  return (
    <div className="game-stats">

      <div className="game-stat">

        <span>
          SCORE
        </span>

        <strong>
          {score}
        </strong>

      </div>

      <div className="game-stat timer-stat">

        <span>
          TIME
        </span>

        <strong>
          {time}s
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   MAIN GAME PAGE
========================================================= */

export default function GamePage() {

  const { slug } = useParams();

  const info = getGameBySlug(slug);

  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState(0);

  const finishedRef = useRef(false);


  /* =====================================================
     SAVE SCORE
  ===================================================== */

  const finishGame = useCallback(
    async (score) => {

      if (
        finishedRef.current ||
        !info
      ) {
        return;
      }

      finishedRef.current = true;

      const safeScore = Math.max(
        0,
        Math.floor(Number(score) || 0)
      );

      const coins = Math.max(
        5,
        Math.min(
          100,
          Math.floor(safeScore / 10) + 5
        )
      );

      setFinalScore(safeScore);
      setEarnedCoins(coins);
      setSaving(true);

      try {

        await api.post("scores/", {
          game: info.id,
          score: safeScore,
          coins,
        });

        const oldCoins = Number(
          localStorage.getItem("coins") || 0
        );

        localStorage.setItem(
          "coins",
          String(oldCoins + coins)
        );

        console.log(
          "Score saved successfully"
        );

      } catch (error) {

        console.error(
          "Score save failed:",
          error
        );

      } finally {

        setSaving(false);
        setFinished(true);

      }
    },
    [info]
  );


  /* =====================================================
     PLAY AGAIN
  ===================================================== */

  const playAgain = () => {

    finishedRef.current = false;

    setFinished(false);
    setFinalScore(0);
    setEarnedCoins(0);
    setSaving(false);

    setSession((prev) => prev + 1);
  };


  /* =====================================================
     GAME NOT FOUND
  ===================================================== */

  if (!info) {

    return (
      <div className="game-page">

        <div className="not-found">

          <div className="not-found-icon">
            🎮
          </div>

          <h1>
            Game Not Found
          </h1>

          <p>
            The game you are looking for does not exist.
          </p>

          <Link
            to="/"
            className="primary-game-btn"
          >
            Back to Games
          </Link>

        </div>

      </div>
    );
  }


  /* =====================================================
     SELECT GAME
  ===================================================== */

  const renderGame = () => {

    switch (info.slug) {

      case "reaction-game":
        return (
          <ReactionRush
            key={session}
            onFinish={finishGame}
          />
        );

      case "memory-match":
        return (
          <MemoryFlip
            key={session}
            onFinish={finishGame}
          />
        );

      case "number-rush":
        return (
          <NumberHunt
            key={session}
            onFinish={finishGame}
          />
        );

      case "quick-tap":
        return (
          <TargetShooter
            key={session}
            onFinish={finishGame}
          />
        );

      case "color-match":
        return (
          <ColorClash
            key={session}
            onFinish={finishGame}
          />
        );

      case "word-puzzle":
        return (
          <WordScramble
            key={session}
            onFinish={finishGame}
          />
        );

      case "bubble-pop":
        return (
          <BubbleBlast
            key={session}
            onFinish={finishGame}
          />
        );

      case "2048-challenge":
        return (
          <Mini2048
            key={session}
            onFinish={finishGame}
          />
        );

      case "speed-quiz":
        return (
          <SpeedQuiz
            key={session}
            onFinish={finishGame}
          />
        );

      case "catch-it":
        return (
          <CoinCatcher
            key={session}
            onFinish={finishGame}
          />
        );

      case "block-puzzle":
        return (
          <BlockStack
            key={session}
            onFinish={finishGame}
          />
        );

      case "lucky-spin":
        return (
          <LuckyWheel
            key={session}
            onFinish={finishGame}
          />
        );

      case "treasure-hunt":
        return (
          <TreasureHunt
            key={session}
            onFinish={finishGame}
          />
        );

      default:
        return (
          <div className="unsupported-game">
            Game coming soon...
          </div>
        );
    }
  };


  /* =====================================================
     RESULT SCREEN
  ===================================================== */

  if (finished) {

    return (
      <div className="game-page">

        <GameTopBar
          onBack={() => {
            window.location.href = "/";
          }}
        />

        <div className="result-page">

          <div className="result-card">

            <div className="result-icon">
              🏆
            </div>

            <span className="result-label">
              GAME COMPLETE
            </span>

            <h1>
              Great Job!
            </h1>

            <p>
              You completed{" "}
              <strong>{info.name}</strong>
            </p>

            <div className="result-score">
              {finalScore}
            </div>

            <div className="result-score-label">
              FINAL SCORE
            </div>

            <div className="earned-reward">
              🪙 +{earnedCoins} Coins
            </div>

            {saving && (
              <div className="saving-message">
                Saving your score...
              </div>
            )}

            <div className="result-buttons">

              <button
                className="primary-game-btn"
                onClick={playAgain}
              >
                🔄 Play Again
              </button>

              <Link
                to="/"
                className="secondary-game-btn"
              >
                🎮 More Games
              </Link>

              <Link
                to="/scores"
                className="secondary-game-btn"
              >
                🏆 My Scores
              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="game-page">

      <GameTopBar
        onBack={() => {
          window.location.href = "/";
        }}
      />


      <main className="game-main">

        {/* GAME HEADER */}

        <div className="game-heading">

          <div className="game-heading-icon">
            🎮
          </div>

          <div>

            <span className="game-eyebrow">
              VELOOP REWARDS
            </span>

            <h1>
              {info.name}
            </h1>

            <p>
              {info.description}
            </p>

          </div>

        </div>


        {/* GAME + INFO */}

        <div className="game-layout">

          <section className="game-container">

            <div className="game-container-header">

              <div>
                <span>
                  PLAY NOW
                </span>

                <h2>
                  {info.name}
                </h2>
              </div>

              <div className="reward-badge">
                🪙 Up to {info.reward} Coins
              </div>

            </div>

            <div className="actual-game">

              {renderGame()}

            </div>

          </section>


          {/* SIDEBAR */}

          <aside className="game-sidebar">

            <div className="info-card">

              <h3>
                🎯 How To Play
              </h3>

              <div className="instruction">

                <span>
                  01
                </span>

                <p>
                  Read the game instructions.
                </p>

              </div>

              <div className="instruction">

                <span>
                  02
                </span>

                <p>
                  Complete the challenge.
                </p>

              </div>

              <div className="instruction">

                <span>
                  03
                </span>

                <p>
                  Get the highest score.
                </p>

              </div>

              <div className="instruction">

                <span>
                  04
                </span>

                <p>
                  Earn Game Coins.
                </p>

              </div>

            </div>


            <div className="reward-card">

              <span>
                REWARD
              </span>

              <strong>
                🪙 {info.reward}
              </strong>

              <p>
                Complete the game and earn rewards.
              </p>

            </div>


            <Link
              to="/"
              className="all-games-btn"
            >
              🎮 View All Games
            </Link>

          </aside>

        </div>

      </main>

    </div>
  );
}