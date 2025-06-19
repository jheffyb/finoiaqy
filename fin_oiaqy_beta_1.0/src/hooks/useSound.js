
import { useCallback } from 'react';

const createTone = (audioContext, frequency, type = 'sine', duration = 0.1, volume = 0.1) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const soundEffects = {
  click: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 800, 'triangle', 0.05, 0.08);
    createTone(audioContext, 400, 'triangle', 0.1, 0.05);
  },
  success: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 523, 'sine', 0.1, 0.1); // C5
    setTimeout(() => createTone(audioContext, 659, 'sine', 0.1, 0.1), 100); // E5
    setTimeout(() => createTone(audioContext, 784, 'sine', 0.15, 0.1), 200); // G5
  },
  error: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 200, 'square', 0.15, 0.1);
    setTimeout(() => createTone(audioContext, 100, 'square', 0.15, 0.08), 50);
  },
  hover: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 1200, 'triangle', 0.03, 0.03);
  },
  swoosh: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  },
  'score-increase': () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 600, 'sine', 0.1, 0.08);
    setTimeout(() => createTone(audioContext, 800, 'sine', 0.1, 0.08), 80);
    setTimeout(() => createTone(audioContext, 1000, 'sine', 0.15, 0.1), 160);
  },
  'score-decrease': () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 400, 'sawtooth', 0.1, 0.08);
    setTimeout(() => createTone(audioContext, 300, 'sawtooth', 0.1, 0.08), 80);
    setTimeout(() => createTone(audioContext, 200, 'sawtooth', 0.15, 0.1), 160);
  },
  'success-glimmer': () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 1000, 'triangle', 0.1, 0.05);
    setTimeout(() => createTone(audioContext, 1500, 'triangle', 0.2, 0.08), 50);
    setTimeout(() => createTone(audioContext, 2000, 'triangle', 0.3, 0.05), 100);
  },
  'notification-chime': () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createTone(audioContext, 784, 'sine', 0.2, 0.1); // G5
    setTimeout(() => createTone(audioContext, 1046, 'sine', 0.3, 0.08), 150); // C6
  }
};

export const useSound = () => {
  const playSound = useCallback((soundName) => {
    try {
      if (soundEffects[soundName]) {
        soundEffects[soundName]();
      }
    } catch (error) {
      console.log('Audio not available or error playing sound:', error);
    }
  }, []);

  return { playSound };
};
