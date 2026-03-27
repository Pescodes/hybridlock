import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // --- INITIAL STATE ---
  combination: [0, 0, 0, 0],
  target: [3, 4, 6, 6], // You can change this to a random array later
  attempts: 10,
  history: [], 
  lastFeedback: { exactMatches: 0, misplaced: 0 },

  // --- ACTIONS ---

  // Changes a single digit when a user clicks an arrow
  setDigit: (index, value) => set((state) => {
    const newCombination = [...state.combination];
    newCombination[index] = value;
    return { combination: newCombination };
  }),

  // This runs ONLY when the fingerprint is scanned
  submitGuess: () => {
    const { combination, target, attempts, history } = get();
    
    // Stop if player is out of attempts
    if (attempts <= 0) return;

    let exactMatches = 0;
    let misplaced = 0;

    const targetCopy = [...target];
    const guessCopy = [...combination];

    // 1. Calculate Exact Matches (Blue Padlock)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === targetCopy[i]) {
        exactMatches++;
        targetCopy[i] = null; 
        guessCopy[i] = null;
      }
    }

    // 2. Calculate Misplaced Digits (Amber Padlock)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== null) {
        const foundIndex = targetCopy.indexOf(guessCopy[i]);
        if (foundIndex !== -1) {
          misplaced++;
          targetCopy[foundIndex] = null;
        }
      }
    }

    // 3. Create a record for the History Log
    const newLogEntry = {
      digits: [...combination],
      exact: exactMatches,
      misplaced: misplaced
    };

    // 4. Update the state
    set({ 
      lastFeedback: { exactMatches, misplaced },
      attempts: attempts - 1,
      history: [newLogEntry, ...history] // Puts the newest guess at the top
    });
  },

  // Reset everything for a fresh start
  newGame: () => set({
    combination: [0, 0, 0, 0],
    target: Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)),
    attempts: 10,
    history: [],
    lastFeedback: { exactMatches: 0, misplaced: 0 }
  })
}));