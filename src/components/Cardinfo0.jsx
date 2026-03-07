// src/components/InfoCard.jsx
'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Cardinfo({ title, rows, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={clsx(
        // layout & glass effect
        'flex flex-col gap-4 rounded-2xl p-6 md:p-8 backdrop-blur-md',
        // translucent background according to theme
        'bg-zinc-0/70 dark:bg-zinc-900/70',
        // BORDER ✨
        // ──────────────────────────────────────────────────────────────
        // Mild opposite‑tone border by default, stronger on hover.
        'border border-zinc-900/15 dark:border-zinc-50/15',
        'hover:border-zinc-900/80 dark:hover:border-zinc-50/80',
        // transitions
        'transition-all duration-300'
      )}
    >
      <h3 className="text-xl font-semibold italic text-secondary-500 mb-2">
        {title}
      </h3>

      {rows.map(({ label, text }) => (
        <div key={label}>
          <p className="uppercase text-[11px] tracking-widest font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {text}
          </p>
        </div>
      ))}
    </motion.article>
  );
}
