import { useEffect } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';

const COLORS = ['#f97316', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4'];

const ConfettiComponent = ({ trigger }) => {
  useEffect(() => {
    if (!trigger) return;

    for (let index = 0; index < 50; index += 1) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-10px';
      confetti.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }, [trigger]);

  return null;
};

export const Confetti = registerTangerineComponent('Confetti', ConfettiComponent);

export default Confetti;
