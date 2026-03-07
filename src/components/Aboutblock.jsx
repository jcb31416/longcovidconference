// src/components/Aboutblock.jsx
"use client";

//-- imports ---------------------------------------------------------------
import React                          from "react";
import { motion }                     from "framer-motion";
import Herocoverlat                   from "@/components/Herocoverlat.jsx";
//-- endimports -------------------------------------------------------------

//-- component --------------------------------------------------------------
/**
 * Re‑usable two‑column block used on the About page.
 *
 * @param {string}  str_tit        Title for the hero cover.
 * @param {string}  str_subtit     Subtitle for the hero cover.
 * @param {string}  str_gifname    Gif filename (without extension) for the hero cover.
 * @param {React.FC} Content       React component to be rendered inside the frosted panel.
 */
export default function Aboutblock({
  str_tit,
  str_subtit,
  str_gifname,
  Content,
}) {
  return (
    <div className="relative flex flex-col md:flex-row gap-10 md:gap-16 py-24">
      {/* hero cover ------------------------------------------------------ */}
      <div className="md:basis-1/3 w-full">
        <Herocoverlat
          str_tit={str_tit}
          str_subtit={str_subtit}
          str_gifname={str_gifname}
        />
      </div>

      {/* frosted-glass panel with animated reveal ------------------------ */}
      <motion.article
        className="overflow-hidden relative z-10 md:basis-2/3 w-full rounded-3xl border border-zinc-900/15 dark:border-zinc-50/15 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-2xl px-8 sm:px-12 py-14 prose prose-zinc dark:prose-invert"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        {Content ? <Content /> : null}
      </motion.article>

      {/* subtle glow behind the panel ------------------------------------ */}
      <motion.div
        className="absolute md:basis-2/3 w-full rounded-3xl bg-gradient-to-br from-emerald-400/20 via-fuchsia-500/10 to-purple-600/20 blur-3xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
    </div>
  );
} //endfun Aboutblock
