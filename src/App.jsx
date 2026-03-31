import './App.css'
import Tumbler from './components/Tumbler'
import { useGameStore } from './store/useGameStore'
import { Lock, Unlock, Fingerprint, Coins } from 'lucide-react' // Added Coins icon
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BootScreen from './components/BootScreen'

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const { 
    combination, 
    lastFeedback, 
    attempts, 
    gems, 
    history, 
    submitGuess, 
    newGame, 
    useGem, 
    isGameOver 
  } = useGameStore();

  const { exactMatches, misplaced } = lastFeedback;
  const isWon = exactMatches === 4;

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
          {/* --- HEADER: GEMS & ATTEMPTS --- */}
          <div className="flex justify-between items-center mb-4">
            <div className="gem-counter flex items-center gap-2 text-amber-400">
              <Coins size={18} className="drop-shadow-[0_0_8px_#ffaa00]" />
              <span className="font-bold">{gems} CREDITS</span>
            </div>
            <div className="attempts-badge">SYSTEM ACCESS TRIALS: {attempts}</div>
          </div>

          {/* --- 2. HOLOGRAM PADLOCKS --- */}
          <div className="padlock-display">
             <div className={`padlock-unit ${exactMatches > 0 ? 'lit' : ''}`}>
                <Lock size={48} className="icon" />
                <p>{exactMatches} EXACT</p>
             </div>
             <div className={`padlock-unit ${misplaced > 0 ? 'lit-alt' : ''}`}>
                <Unlock size={48} className="icon" />
                <p>{misplaced} MISPLACED</p>
             </div>
          </div>

          <h2 className="status-text">
            {isWon ? "ACCESS GRANTED" : isGameOver ? "SYSTEM LOCKOUT" : "BRUTE FORCE IN PROGRESS"}
          </h2>

          {/* --- 3. TUMBLERS (ROTARY DRAG) --- */}
          <div className="lock-interface">
             {combination.map((_, i) => (
               <Tumbler key={i} index={i} />
             ))}
          </div>

          {/* --- 4. BIOMETRIC SCANNER --- */}
          <div className="scanner-section">
            <button 
              className={`finger-btn ${isWon ? 'won' : isGameOver ? 'failed' : ''}`} 
              onClick={isWon || isGameOver ? null : submitGuess}
              disabled={isWon || isGameOver}
            >
              <Fingerprint size={70} />
            </button>
          </div>

          {/* --- 5. HISTORY LOG --- */}
          <div className="history-log">
            <p className="log-title">DECRYPTED SEQUENCES</p>
            <div className="log-entries">
              {history.length === 0 && <p className="empty-log">NO DATA CAPTURED...</p>}
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

          {/* --- 6. END GAME OVERLAY (WON / LOST) --- */}
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
                  <p>{isWon ? "Database access granted. Well done, operative." : "Security lockout initiated. Authorization required."}</p>
                  
                  <div className="flex flex-col gap-3 mt-6">
                    {isGameOver && (
                      <button 
                        onClick={useGem} 
                        className="reboot-btn flex items-center justify-center gap-2 bg-amber-500/10 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
                      >
                        <Coins size={16} /> SPEND 1 CREDIT TO BYPASS
                      </button>
                    )}
                    
                    <button onClick={newGame} className="reboot-btn">
                      {isWon ? "NEW TARGET" : "HARD REBOOT (WIPE PROGRESS)"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;