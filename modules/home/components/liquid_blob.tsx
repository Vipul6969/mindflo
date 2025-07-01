import React from 'react';

import { motion } from 'framer-motion';

export const LiquidBlob = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    animate={{
      scale: [1, 1.2, 0.8, 1],
      rotate: [0, 180, 360],
      borderRadius: ['50%', '40% 60%', '60% 40%', '50%'],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);
