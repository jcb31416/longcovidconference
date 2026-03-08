"use client";

import { useMemo, useState, useEffect }          from "react";
import Image                from "next/image";
import { motion }           from "framer-motion";
import { fun_fetch }        from "@/utils/front/mod_front.js";

const dc2_leftvaris         = { hidden: { x: -80, opacity: 0 }, show: { x: 0, opacity: 1 } };
const dc2_rightvaris        = { hidden: { x: 80, opacity: 0 }, show: { x: 0, opacity: 1 } };

// function fun2_name(str, tto=undefined) { // :dev 20260224_1033. mirar la misma nota yyyymmdd.. en mod_back se pueden ir metiendo más casos de uso, como por ejemplo meter como arg dirmt el nombre
//   let resp;
//   if (!str) return "";
//   resp = str.split(/[_\-\s]+/g).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
//
//   if (tto) { // si hay campo de tratamiento, lo añade (eg, PhD, MD)
//     resp = `${resp}, ${tto}`;
//   }//if tratamiento PhD, MD,..
//
//   return resp;
// }//endfun fun2_name


function fun2_name(dic) { // :dev 20260224_1033. mirar la misma nota yyyymmdd.. en mod_back se pueden ir metiendo más casos de uso, como por ejemplo meter como arg dirmt el nombre

  let resp = dic.name;

  if (dic.tto) { // si hay campo de tratamiento, lo añade (eg, PhD, MD)
    resp = `${resp}, ${dic.tto}`;
  }//if tratamiento PhD, MD,..

  return resp;
}//endfun fun2_name






export default function Panelistas({ lis_speakernames, str_className = "" }) {

  const [lsd_sorted, set_lsd_sorted] = useState([]);




  useEffect(() => {

    async function fun_names2lsd() {

      const form_1 = new FormData();
      form_1.set("lis_speakernames", JSON.stringify(lis_speakernames)); // ✅ if it's an array
      const resp = await fun_fetch({ str_api: "/api/central", form: form_1, str_fun: "funbck_getdetailspeakers" });
      // console.log(`resp: ${resp}`); // :chk 260225

      // const lsd = Object.entries(resp.resp.dc2_speakers ?? {}).map(([key, dic]) => ({
      const lsd = Object.entries(resp.resp ?? {}).map(([key, dic]) => ({
        key,
        name: fun2_name(dic),
        descrip: dic?.descrip ?? "",
        url: dic?.url ?? null,
      }));

      debugger;

      set_lsd_sorted(lsd.sort((a, b) => a.name.localeCompare(b.name)));
    }//endfun fun_names2lsd

    if (lis_speakernames?.length) fun_names2lsd();
  }, [lis_speakernames]);




  return (
    <section className={["w-full", str_className].join(" ")}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Panelistas</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Alfabéticamente</p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-10">
        {lsd_sorted.map((dic_member, index) => (

          <div  key={dic_member.key}  className="w-full max-w-[920px]    flex items-stretch justify-center gap-7    max-sm:flex-col max-sm:gap-3">


          <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
          variants={dc2_leftvaris}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: index * 0.08 }}
          className="relative flex items-center justify-center w-[260px] h-[170px] max-sm:w-full max-sm:h-[120px] bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.55)] [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_40px),calc(100%_-_40px)_100%,0_100%)] max-sm:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
          >
            <div className="relative h-24 w-24 max-sm:h-20 max-sm:w-20 overflow-hidden rounded-full shadow-[0_0_20px_rgba(0,0,0,0.6)]">
              {dic_member.url ? (
                <Image src={dic_member.url} alt={dic_member.name} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900/30 text-xs text-zinc-200">no img</div>
              )}
            </div>
          </motion.div>

          <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
          variants={dc2_rightvaris}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: index * 0.08 + 0.05 }}
          className="relative flex flex-col justify-center w-[640px] min-h-[170px] max-sm:w-full max-sm:min-h-0 bg-black/40 px-7 py-5 max-sm:px-4 max-sm:py-4 border border-white/10 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.55)] [clip-path:polygon(40px_0,100%_0,100%_100%,0_100%,0_40px)] max-sm:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
          >
            <h3 className="mb-2 text-[1.05rem] max-sm:text-[1rem] font-semibold text-white">{dic_member.name}</h3>
            <p className="text-[0.85rem] max-sm:text-[0.8rem] leading-relaxed text-[#00ff5c] [text-shadow:0_0_6px_rgba(0,255,92,0.3)]">
              {dic_member.descrip}
            </p>
          </motion.div>




          </div>
        ))} {/*end for dic_member ~dc2_speakers in lsd_sorted*/}
      </div>
    </section>
  );
}
