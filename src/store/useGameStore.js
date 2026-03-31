import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl } from 'howler';

// --- SOUND ENGINE SETUP ---
const sfx = {
  scan: new Howl({ src: ['/sounds/scan-pulse.mp3'], volume: 0.4 }),
  success: new Howl({ src: ['/sounds/access-granted.mp3'], volume: 0.6 }),
  fail: new Howl({ src: ['/sounds/lockout-alarm.mp3'], volume: 0.5 }),
  revive: new Howl({ src: ['/sounds/system-reboot.mp3'], volume: 0.7 }),
  click: new Howl({ src: ['/sounds/digit-click.mp3'], volume: 0.2 }),
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      combination: [0, 0, 0, 0],
      target: Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)),
      attempts: 10,
      gems: 5,
      history: [],
      lastFeedback: { exactMatches: 0, misplaced: 0 },
      isGameOver: false,

      // --- ACTIONS ---

      setDigit: (index, value) => {
        const { combination, isGameOver } = get();
        
        // Prevent interaction if game is over
        if (isGameOver) return;

        // Play sound only if value actually changed
        if (combination[index] !== value) {
          sfx.click.stop(); // Stop previous to prevent stacking during fast drags
          sfx.click.play();
        }

        set((state) => {
          const newCombination = [...state.combination];
          newCombination[index] = value;
          return { combination: newCombination };
        });
      },

      useGem: () => {
        const { gems, isGameOver } = get();
        if (gems > 0 && isGameOver) {
          sfx.revive.play();
          set({
            gems: gems - 1,
            attempts: 5, // Give them 5 more tries
            isGameOver: false,
          });
          return true;
        }
        return false;
      },

      submitGuess: () => {
        const { combination, target, attempts, history, isGameOver } = get();

        if (isGameOver || attempts <= 0) return;

        sfx.scan.play();

        let exactMatches = 0;
        let misplaced = 0;
        const targetCopy = [...target];
        const guessCopy = [...combination];

        // 1. Calculate Exact Matches
        for (let i = 0; i < 4; i++) {
          if (guessCopy[i] === targetCopy[i]) {
            exactMatches++;
            targetCopy[i] = null;
            guessCopy[i] = null;
          }
        }

        // 2. Calculate Misplaced Digits
        for (let i = 0; i < 4; i++) {
          if (guessCopy[i] !== null) {
            const foundIndex = targetCopy.indexOf(guessCopy[i]);
            if (foundIndex !== -1) {
              misplaced++;
              targetCopy[foundIndex] = null;
            }
          }
        }

        const newLogEntry = {
          digits: [...combination],
          exact: exactMatches,
          misplaced: misplaced,
        };

        const newAttempts = attempts - 1;
        const hasWon = exactMatches === 4;
        const hasLost = newAttempts <= 0 && !hasWon;

        if (hasWon) {
          sfx.success.play();
        } else if (hasLost) {
          sfx.fail.play();
        }

        set({
          lastFeedback: { exactMatches, misplaced },
          attempts: newAttempts,
          history: [newLogEntry, ...history],
          isGameOver: hasLost,
        });
      },

      newGame: () => {
        set({
          combination: [0, 0, 0, 0],
          target: Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)),
          attempts: 10,
          history: [],
          lastFeedback: { exactMatches: 0, misplaced: 0 },
          isGameOver: false,
        });
      },
    }),
    {
      name: 'hybridlock-storage',
      // Persist gems and game status so they don't lose 'purchased' revives on refresh
      partialize: (state) => ({ 
        gems: state.gems, 
        isGameOver: state.isGameOver,
        target: state.target 
      }),
    }
  )
);