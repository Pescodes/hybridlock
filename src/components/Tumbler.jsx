import { useGameStore } from '../store/useGameStore'
import { motion, AnimatePresence } from 'framer-motion'

const Tumbler = ({ index }) => {
  const { combination, setDigit } = useGameStore();
  const value = combination[index];

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
    }
  };

  return (
    <div className="tumbler-column">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDrag={handleDrag}
        className="digit-container"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="digit-display"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Tumbler;