// src/components/Digifloat.jsx
'use client';


import { motion }                       from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

/* ───── helpers ─────────────────────────────────────────────────────────── */
function fun_rand(seed = 1) {           // 32-bit LCG, deterministic
  let int_state = seed >>> 0;
  return () =>
    ((int_state = (1664525 * int_state + 1013904223) >>> 0) / 2 ** 32);
}

function fun_genSeq(int_n = 1000, int_seed = 1) {  // 10-mer RNA strings
  const fun_r        = fun_rand(int_seed);
  const lis_letters  = ['A', 'C', 'G', 'U'];

  return Array.from({ length: int_n }, () =>
    Array.from({ length: 10 }, () =>
      lis_letters[Math.floor(fun_r() * 4)]
    ).join('')
  );
}



const fun_sleep = ms => new Promise(r => setTimeout(r, ms));
/* ────────────────────────────────────────────────────────────────────────── */

export default function Digifloat({ int_count = 40, int_stepMs = 50 }) {
  const [lis_dots, set_dots]   = useState([]);   // ← renderable dots
  const [int_counter, set_ctr] = useState(0);    // shared deterministic counter

  /* same on server & client → no hydration warning */
  const lis_seqBank = useMemo(() => fun_genSeq(1000, 1337), []);

  useEffect(() => {
    let boo_alive = true;

    (async () => {
      const fun_r = fun_rand(1337);      // one RNG for all dots
      const lis_next = [];

      for (let i = 0; i < int_count; i++) {
        await fun_sleep(int_stepMs);     // stagger creation

        const str_seq = lis_seqBank[int_counter % lis_seqBank.length];
        set_ctr(prev => prev + 1);       // advance global counter

        /* call RNG each time to vary values */
        lis_next.push({
          id: i,
          txt: str_seq,
          x: fun_r() * 100,
          y: fun_r() * 100,
          size: 0.4 + fun_r() * 0.6,
          delay: fun_r() * 5,
          dur: 5 + fun_r() * 6,
        });
      }

      if (boo_alive) set_dots(lis_next);
    })();

    return () => {
      boo_alive = false;                 // cleanup if component unmounts
    };
  }, [int_count, int_stepMs, lis_seqBank, int_counter]);



  return (
    <div className="pointer-events-none absolute inset-0 -z-5">
      {lis_dots.map(({ id, txt, x, y, size, delay, dur }) => (
        <motion.span
          key={id}
          className="absolute font-mono text-emerald-500/70 dark:text-emerald-300/60 select-none"
          style={{ left: `${x}vw`, top: `${y}vh`, fontSize: `${size}rem` }}
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
