import './App.css'
import Tumbler from './components/Tumbler'
import { useGameStore } from './store/useGameStore'
import { Lock, Unlock, Fingerprint } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BootScreen from './components/BootScreen'

// ... imports remain the same

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const { combination, lastFeedback, attempts, history, submitGuess, newGame } = useGameStore();

  const { exactMatches, misplaced } = lastFeedback;
  const isWon = exactMatches === 4;
  const isGameOver = attempts <= 0 && !isWon;

  return (
    <AnimatePresence mode="wait">
      {isBooting ? (
        <BootScreen key="boot" onComplete={() => setIsBooting(false)} />
      ) : (
        <motion.div 
          key="game"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-container"
        >
          {/* 1. ATTEMPTS COUNTER */}
          <div className="attempts-badge">SYSTEM ACCESS TRIALS: {attempts}</div>

          {/* 2. HOLOGRAM PADLOCKS */}
          <div className="padlock-display">
             <div className={`padlock-unit ${exactMatches > 0 ? 'lit' : ''}`}>
                <Lock size={48} className="icon" />
                <p>{exactMatches} </p>
             </div>
             <div className={`padlock-unit ${misplaced > 0 ? 'lit-alt' : ''}`}>
                <Unlock size={48} className="icon" />
                <p>{misplaced}</p>
             </div>
          </div>

          <h2 className="status-text">
            {isWon ? "ACCESS GRANTED" : isGameOver ? "SYSTEM LOCKOUT" : "BRUTE FORCE IN PROGRESS"}
          </h2>

          {/* 3. TUMBLERS */}
          <div className="lock-interface">
             {combination.map((_, i) => (
               <Tumbler key={i} index={i} />
             ))}
          </div>

          {/* 4. BIOMETRIC SCANNER */}
          <div className="scanner-section">
            <button 
              className={`finger-btn ${isWon ? 'won' : isGameOver ? 'failed' : ''}`} 
              onClick={isWon || isGameOver ? newGame : submitGuess}
            >
              <Fingerprint size={70} />
            </button>
          </div>

          {/* 5. HISTORY LOG */}
          <div className="history-log">
            <p className="log-title">DECRYPTED SEQUENCES</p>
            <div className="log-entries">
              {history.map((entry, index) => (
                <div key={index} className="log-entry">
                  <span className="log-digits">{entry.digits.join(' ')}</span>
                  <div className="log-feedback-mini">
                    <span className="blue">{entry.exact}E</span>
                    <span className="amber">{entry.misplaced}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- INSERT THE OVERLAY HERE (Just before game-container ends) --- */}
          <AnimatePresence>
            {(isWon || isGameOver) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="end-screen-overlay"
              >
                <motion.div 
                  initial={{ scale: 0.5, y: 20 }} 
                  animate={{ scale: 1, y: 0 }} 
                  className="end-card"
                >
                  <h1>{isWon ? "SYSTEM COMPROMISED" : "TERMINAL LOCKED"}</h1>
                  <p>{isWon ? "Database access granted. Well done, operative." : "Security lockout initiated. Try again."}</p>
                  <button onClick={newGame} className="reboot-btn">REBOOT SYSTEM</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div> /* --- End of game-container --- */
      )}
    </AnimatePresence>
  );
}

export default App;