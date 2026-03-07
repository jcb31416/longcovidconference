// src/components/Digifloat.jsx
'use client';

import { motion } from 'framer-motion';

export default function Digifloat({ count = 30 }) {

  const lis_ACGU      = ['A', 'C', 'G', 'U'];
  const val_basedelay = 5;
  const dots          = Array.from({ length: count }, (_, i) => {

    const txt = Array.from({ length: 10 }, (_, k) =>
      lis_ACGU[(i * 7 + k * 3) % 4]
    ).join('');

    // const rand = (p => ((p = (p * 1664525 + 1013904223) >>> 0) / 2**32))(i);
    const val_i = i;

    return {
      id:    val_i,
      txt,
      x:     (val_i * 23) % 100,
      y:     (val_i * 41) % 100,
      size:  0.7 + (val_i % 3) * 0.15,
      delay: val_basedelay + (val_i % 5) * 0.4,
      dur:   5 + (val_i % 3),
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 -z-5">
      {dots.map(({ id, txt, x, y, size, delay, dur }) => (
        <motion.span
          key={id}
          className="absolute font-mono text-black/50 select-none tracking-tight"
          style={{ left: `${x}vw`, top: `${y}vh`, fontSize: `${size * 0.5}rem` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [10, -10, 10] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {txt}
        </motion.span>
      ))}
    </div>
  );
}
