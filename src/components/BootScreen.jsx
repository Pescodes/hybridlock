import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootScreen = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const messages = [
    "> INITIALIZING HYBRIDLOCK_OS...",
    "> LOADING BIOMETRIC_DATABASE...",
    "> CONNECTING TO NEURAL_NETWORK...",
    "> BYPASSING FIREWALL...",
    "> ACCESS GRANTED. LOADING INTERFACE..."
  ];

  useEffect(() => {
    // 1. Handle Typing Logs
    messages.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
      }, i * 600);
    });

    // 2. Handle Progress Bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Hide screen when done
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="boot-overlay"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="terminal-window">
        <div className="terminal-header">SYSTEM_BOOT_v2.0.4</div>
        <div className="terminal-body">
          {logs.map((log, i) => (
            <p key={i} className="terminal-text">{log}</p>
          ))}
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="percentage">{progress}%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BootScreen;