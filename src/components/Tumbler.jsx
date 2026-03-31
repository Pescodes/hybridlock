import { useGameStore } from '../store/useGameStore'
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion'
=======
import { motion, useMotionValue, useTransform } from 'framer-motion'
>>>>>>> parent of 6782512 (Revert "Update Tumbler.jsx")

const Tumbler = ({ index }) => {
  const { combination, setDigit } = useGameStore();
  const value = combination[index];

<<<<<<< HEAD
  const handleDrag = (_, info) => {
    // Distance dragged (threshold). 30px move = 1 number change.
    const threshold = 30;
    const change = Math.round(info.offset.y / threshold);
    
    if (change !== 0) {
      // (value - change) allows dragging UP to increase the number
      let newVal = (value - change + 10) % 10;
      if (newVal !== value) {
        setDigit(index, newVal);
      }
=======
  // This tracks the vertical drag distance
  const dragY = useMotionValue(0);

  // We use this to detect a "step" in the drag (e.g., every 40 pixels = 1 digit change)
  const handleDrag = (_, info) => {
    const threshold = 40; // Sensitivity: distance moved to change one number
    const change = Math.round(info.offset.y / threshold);
    
    if (change !== 0) {
      // Calculate new value (0-9 loop)
      let newVal = (value - change + 10) % 10;
      setDigit(index, newVal);
      
      // We don't reset dragY here because Framer handles the offset 
      // relative to the start of the gesture.
>>>>>>> parent of 6782512 (Revert "Update Tumbler.jsx")
    }
  };

  return (
<<<<<<< HEAD
    <div className="tumbler-column">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDrag={handleDrag}
        className="digit-container"
      >
        <AnimatePresence mode="popLayout">
=======
    <div className="tumbler-column flex flex-col items-center justify-center select-none">
      <div className="digit-container relative h-24 w-16 overflow-hidden bg-zinc-950 border-x border-zinc-800 flex items-center justify-center">
        
        {/* The Draggable Dial */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }} // Snap back to center
          dragElastic={0.2}
          onDrag={handleDrag}
          className="cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center"
        >
>>>>>>> parent of 6782512 (Revert "Update Tumbler.jsx")
          <motion.div
            key={value}
            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
<<<<<<< HEAD
            exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="digit-display"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </motion.div>
=======
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-4xl font-mono font-bold text-cyan-400 [text-shadow:0_0_10px_rgba(34,211,238,0.5)]"
          >
            {value}
          </motion.div>
        </motion.div>

        {/* Cyberpunk Glass Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-60" />
      </div>
>>>>>>> parent of 6782512 (Revert "Update Tumbler.jsx")
    </div>
  );
};

export default Tumbler;