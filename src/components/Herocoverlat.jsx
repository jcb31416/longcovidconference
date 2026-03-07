"use client";

//-- imports ---------------------------------------------------------------
import React                          from "react";
import { motion }                     from "framer-motion";
// import Link                       from "next/link"; // currently not used
//-- endimports -------------------------------------------------------------

//-- component --------------------------------------------------------------
export default function Herocoverlat({ str_tit, str_subtit, str_gifname }) { //fun Herocoverlat
  return (
    <> {/* fragment start */}

      {/* hero wrapper --------------------------------------------------- */}
      <section className="relative w-full min-h-[50vh] overflow-hidden flex items-center justify-center text-center">

        {/* background GIF --------------------------------------------------- */}
        <motion.img
          src={`/${str_gifname}.gif`}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover z-5"
          initial={{ opacity: 0 }}                               /* gif starts hidden */
          whileInView={{ opacity: [0, 0.3, 0.3, 0] }}                /* fade in, hold, fade out */
          viewport={{ once: false, amount: 0.1 }}                /* trigger when 30% visible */
          transition={{
            duration: 5,
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut",
          }}
        /> {/* end motion.img */}



        {/* animated mask layer --------------------------------------------- */}
        <motion.div
          className="absolute inset-0 bg-white/60 dark:bg-white/10 backdrop-blur-sm z-7 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 0.3, 0.3, 0] }}
          viewport={{ amount: 0.1 }}
          transition={{
            duration: 5,
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut",
          }}
        /> {/* end motion.div */}

        {/* Overlay text ----------------------------------------------------- */}
        <div className="px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 leading-relaxed pb-2"
            initial={{ filter: "blur(8px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            viewport={{ amount: 0.1 }}
            transition={{ duration: 2.5, ease: "easeIn" }}
          >
            {str_tit}
          </motion.h1>

          <motion.p
            className="font-bold text-lg md:text-xl text-gray-700 dark:text-gray-300"
            style={{ fontFamily: `"Courier New", Courier, monospace` }}
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            {str_subtit}
          </motion.p>
        </div>
      </section> {/* end hero wrapper */}

    </> /* end fragment */
  );
} //endfun Herocoverlat
