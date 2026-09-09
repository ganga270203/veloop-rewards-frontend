import { useState } from "react";
import { CheckCircle2, Coins, Gem, RotateCcw, ShoppingBag, Sparkles, Ticket, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useGameCoins } from "../context/GameCoinContext";
import styles from "./GameRedeem.module.css";

const options = [
  { id:"ves", label:"VEs", icon: Sparkles, cost:100, reward:"10 VEs" },
  { id:"sves", label:"SVEs", icon: ShoppingBag, cost:100, reward:"10 SVEs" },
  { id:"gems", label:"Gems", icon: Gem, cost:50, reward:"5 Gems" },
  { id:"tokens", label:"Tokens", icon: Ticket, cost:100, reward:"20 Tokens" },
  { id:"spins", label:"Spins", icon: RotateCcw, cost:50, reward:"3 Spins" }
];

export default function GameRedeem() {
  const { balance, update } = useGameCoins();
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");

  const redeem = () => {
    if (!selected) return;
    if (balance < selected.cost) {
      setStatus(`Not enough Game Coins. You have ${balance}; ${selected.cost} are required.`);
      return;
    }
    update(balance - selected.cost);
    setStatus(`Redemption successful: ${selected.reward}.`);
    setSelected(null);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>← Games</Link>
        <div className={styles.balance}><Coins size={18}/> {balance} Game Coins</div>
      </header>

      <section className={styles.shell}>
        <span className={styles.kicker}>CENTRAL REWARDS</span>
        <h1>Redeem Game Coins</h1>
        <p>Convert your centralized Game Coin balance into VELOOP rewards.</p>

        {status && <div className={styles.status}><CheckCircle2 size={17}/>{status}</div>}

        <div className={styles.grid}>
          {options.map((item) => {
            const Icon = item.icon;
            const disabled = balance < item.cost;
            return (
              <article key={item.id} className={styles.card}>
                <div className={styles.icon}><Icon size={22}/></div>
                <h2>{item.label}</h2>
                <p>{item.cost} Game Coins → {item.reward}</p>
                <button disabled={disabled} onClick={() => setSelected(item)}>
                  {disabled ? "Need More Coins" : "Redeem"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {selected && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.close} onClick={() => setSelected(null)} aria-label="Close"><X/></button>
            <Coins size={25}/>
            <h2>Redeem Game Coins?</h2>
            <p>You are about to convert <b>{selected.cost} Game Coins</b> into <b>{selected.reward}</b>.</p>
            <p>Remaining balance: <b>{balance - selected.cost}</b></p>
            <div className={styles.modalActions}>
              <button className={styles.cancel} onClick={() => setSelected(null)}>Cancel</button>
              <button className={styles.confirm} onClick={redeem}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}