import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

const LockoutModal = () => {
  const { isGameOver, gems, useGem, newGame } = useGameStore();

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border-2 border-red-500 p-8 rounded-lg text-center max-w-sm"
      >
        <h2 className="text-red-500 font-bold text-2xl mb-4 [text-shadow:0_0_10px_red]">
          SYSTEM LOCKOUT
        </h2>
        <p className="text-zinc-400 mb-6">
          Critical failure. Unauthorized access detected. 
          Use a Gem to bypass encryption protocols?
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={useGem}
            disabled={gems <= 0}
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded font-bold disabled:opacity-50"
          >
            USE 1 GEM ({gems} REMAINING)
          </button>
          
          <button 
            onClick={newGame}
            className="text-zinc-500 hover:text-zinc-300 text-sm underline"
          >
            TERMINATE SESSION (WIPE PROGRESS)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LockoutModal;