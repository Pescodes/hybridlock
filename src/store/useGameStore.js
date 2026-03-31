import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl } from 'howler';

// --- SOUND ENGINE SETUP ---
// Note: Make sure these files exist in your /public/sounds/ folder!
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
      target: [3, 4, 6, 6],
      attempts: 10,
      gems: 5,
      history: [],
      lastFeedback: { exactMatches: 0, misplaced: 0 },
      isGameOver: false,

      // --- ACTIONS ---

      setDigit: (index, value) => {
  const { combination, isGameOver } = get();
  if (isGameOver) return;

  // Only play sound if the number actually changes
  if (combination[index] !== value) {
    sfx.click.stop(); // Stops the previous sound immediately
    sfx.click.play(); // Plays the new one
  }

  set((state) => {
    const newCombination = [...state.combination];
    newCombination[index] = value;
    return { combination: newCombination };
  });
},

      useGem: () => {
        const { gems } = get();
        if (gems > 0) {
          // Play the powerful reboot sound
          sfx.revive.play();
          set({
            gems: gems - 1,
            attempts: 5,
            isGameOver: false,
          });
          return true;
        }
        return false;
      },

      submitGuess: () => {
        const { combination, target, attempts, history } = get();

        if (attempts <= 0) {
          set({ isGameOver: true });
          return;
        }

        // Play the scan sound when fingerprint is "processed"
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

        // Play appropriate feedback sound
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

      newGame: () => set({
        combination: [0, 0, 0, 0],
        target: Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)),
        attempts: 10,
        history: [],
        lastFeedback: { exactMatches: 0, misplaced: 0 },
        isGameOver: false,
      }),
    }),
    {
      name: 'hybridlock-storage',
      // We persist gems AND isGameOver so the lockout survives a refresh
      partialize: (state) => ({ gems: state.gems, isGameOver: state.isGameOver }),
    }
  )
);