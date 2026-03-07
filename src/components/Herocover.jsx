"use client";

import React                      from "react";
import { motion }                 from "framer-motion";
import Link                       from 'next/link';

export default function Herocover({ str_tit, str_subtit, str_gifname }) {
  return (
    <>
      <section className="relative w-full min-h-[50vh] overflow-hidden flex items-center justify-center text-center">
        {/* background GIF */}
        <motion.img
          src={`/${str_gifname}.gif`}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover z-5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 5, duration: 1.2, ease: "easeInOut" }}
        />

        {/* animated mask layer */}
        <motion.div
          className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-7"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 5, duration: 1.2, ease: "easeInOut" }}
        />


        {/* Overlay text */}
        <div className="px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 leading-relaxed pb-2"
            initial={{ filter: "blur(8px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeIn" }}
          >
            {str_tit}
          </motion.h1>

          <motion.p
            className="font-bold text-lg md:text-xl text-gray-700 dark:text-gray-300"
            style={{ fontFamily: `"Courier New", Courier, monospace` }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.8, delay: 2.7 }}
          >
            {str_subtit}
          </motion.p>
        </div>
      </section>
    </>
  );
}
