import { useGameStore } from '../store/useGameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

const Tumbler = ({ index }) => {
  const { combination, setDigit } = useGameStore();
  const value = combination[index];

  const adjust = (amt) => {
    let newVal = (value + amt + 10) % 10;
    setDigit(index, newVal);
  };

  return (
    <div className="tumbler-column">
      <button className="arrow-btn" onClick={() => adjust(1)}><ChevronUp /></button>
      
      <div className="digit-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="digit-display"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="arrow-btn" onClick={() => adjust(-1)}><ChevronDown /></button>
    </div>
  );
};

export default Tumbler;