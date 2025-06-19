
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Medal, Heart, AlertTriangle, ShieldAlert, XOctagon } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

const scoreConfig = {
  Excelente: { icon: Medal, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500' },
  Bom: { icon: Heart, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500' },
  Regular: { icon: AlertTriangle, color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500' },
  AltoRisco: { icon: ShieldAlert, color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' },
  Inadimplente: { icon: XOctagon, color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500' },
};

const getStatusKey = (status) => {
  if (!status) return 'Regular'; // Default
  return status.replace(/\s+/g, ''); // Remove spaces for key matching
};

const ScoreBadge = ({ score, status, large = false }) => {
  const { playSound } = useSound();
  const [prevScore, setPrevScore] = useState(score);
  const [displayScore, setDisplayScore] = useState(score);
  const [animateIcon, setAnimateIcon] = useState(false);

  const currentStatusKey = getStatusKey(status);
  const config = scoreConfig[currentStatusKey] || scoreConfig.Regular;
  const IconComponent = config.icon;

  useEffect(() => {
    if (score !== prevScore) {
      if (score > prevScore) {
        playSound('score-increase');
      } else if (score < prevScore) {
        playSound('score-decrease');
      }
      
      // Animate score number change
      const diff = score - prevScore;
      const duration = 500; // ms
      const startTime = Date.now();

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          setDisplayScore(Math.round(prevScore + diff * progress));
          requestAnimationFrame(animate);
        } else {
          setDisplayScore(score);
        }
      };
      requestAnimationFrame(animate);
      
      setAnimateIcon(true);
      setTimeout(() => setAnimateIcon(false), 400); // Duration of icon flash animation
      setPrevScore(score);
    }
  }, [score, prevScore, playSound]);


  return (
    <motion.div
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border-2 ${config.borderColor} ${config.bgColor} ${large ? 'px-4 py-2 space-x-3' : ''}`}
      title={`Score: ${score} - Status: ${status}`}
    >
      <motion.div
        key={status} // Re-trigger animation if status (and thus icon) changes
        className={animateIcon ? 'icon-flash-animation' : ''}
      >
        <IconComponent className={` ${config.color} ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
      </motion.div>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayScore}
            initial={{ y: large ? 20 : 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: large ? -20 : -15, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
            className={`font-semibold ${config.color} ${large ? 'text-lg' : 'text-sm'} tabular-nums`}
          >
            {displayScore}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className={`font-medium ${config.color} ${large ? 'text-base' : 'text-xs'}`}>{status}</span>
    </motion.div>
  );
};

export default ScoreBadge;
