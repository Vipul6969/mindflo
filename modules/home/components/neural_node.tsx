import React from 'react';

import { motion } from 'framer-motion';

// Neural Network Node Component
export const NeuralNode = ({
  x,
  y,
  delay = 0,
  size = 4,
}: {
  x: number;
  y: number;
  delay?: number;
  size?: number;
}): React.ReactElement => {
  return React.createElement(motion.div, {
    className:
      'absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg',
    style: {
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
    },
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.5, 1],
      opacity: [0, 1, 0.7],
      boxShadow: [
        '0 0 0px rgba(139, 92, 246, 0)',
        '0 0 20px rgba(139, 92, 246, 0.8)',
        '0 0 10px rgba(139, 92, 246, 0.4)',
      ],
    },
    transition: {
      duration: 2,
      delay,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  });
};
