"use client";

import { useEffect, useMemo, useState }    from "react";
import { motion }                          from "framer-motion";
import Link                                from "next/link";

import GlassPanel                          from "@/components/GlassPanel.jsx";
import MDrenderer                          from "@/components/MDrenderer.jsx";
import Panelistas                          from "@/components/Panelistas.jsx";
import { fun_fetch }                       from "@/utils/front/mod_front";

import ConferenceProgram                   from "@/components/ConferenceProgram.jsx";
import { funfro_parse_program_markdown }   from "@/utils/front/mod_fro.js";




function fun_pick_conference(lsd_webinars = []) {
    // intenta por slug, y si no existe, por dic_urls.about que en tu Panel se usa para detectar conf_
    const dic_by_slug                       = lsd_webinars.find(
        (dic_webinar) =>
            typeof dic_webinar?.slug === "string" &&
            dic_webinar.slug.startsWith("conf_")
    );

    if (dic_by_slug) {
        return dic_by_slug;
    } //endif

    const dic_by_about                      = lsd_webinars.find(
        (dic_webinar) =>
            typeof dic_webinar?.dic_urls?.about === "string" &&
            dic_webinar.dic_urls.about.includes("conf_")
    );

    if (dic_by_about) {
        return dic_by_about;
    } //endif

    return null;
} //endfun fun_pick_conference

export default function ConferencePage() {
    const [dic_conf, setConf]               = useState(null);
    const [str_err, setErr]                 = useState("");



    useEffect(() => {
        (async () => {
            try {
                const dic_out               = await fun_fetch({  str_api: "/api/central",  dic: {slug:"all"},  str_fun: "funbck_getwebinar"  });
                const lsd_webinars          = dic_out?.resp ?? [];
                const dic_conf_found        = fun_pick_conference(lsd_webinars);

                if (!dic_conf_found) {
                    setErr("No conference found (no item matching conf_).");
                    return;
                } //endif no conference

                setConf(dic_conf_found);
            } catch (err) {
                setErr(String(err?.message ?? err));
            } //endtry
        })();
    }, []);



    // si entran con #program o #panelists, y el contenido tarda en cargar, re-scroll al cargar
    useEffect(() => {
        if (!dic_conf) {
            return;
        } //endif

        const str_hash  =
            typeof window !== "undefined"
                ? window.location.hash?.slice(1)
                : "";

        if (!str_hash) {
            return;
        } //endif

        const obj_el  = document.getElementById(str_hash);

        if (!obj_el) {
            return;
        } //endif

        obj_el.scrollIntoView({ behavior:"smooth", block:"start" });
    }, [dic_conf]);




    const md_program = useMemo(() => {
        if (!dic_conf) {
            return null;
        } //endif

        return dic_conf.md_program ?? dic_conf.md_descrip ?? dic_conf.md_sugges ?? null;
    }, [dic_conf]);

    const dic_program_parsed = useMemo(() => {
        if (!md_program) {
            return null;
        } //endif

        return funfro_parse_program_markdown(md_program);
    }, [md_program]);




    const lis_speaker_names  = useMemo(() => {
        if (!dic_conf) {
            return [];
        } //endif

        return Array.isArray(dic_conf.lis_speakernames) ? dic_conf.lis_speakernames : [];
    }, [dic_conf]);



    if (str_err) {
        return (
            <main className="min-h-screen bg-black px-6 py-16 text-zinc-200">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-2xl font-semibold">Conference</h1>

                    <p className="mt-3 text-zinc-400">
                        {str_err}
                    </p>

                    <p className="mt-3 text-sm text-zinc-500">
                        Tip: asegúrate de tener al menos un documento conf_ en tu colección
                        de webinars.
                    </p>

                    <Link className="mt-6 inline-block underline text-zinc-300" href="/">
                        Back home
                    </Link>
                </div>
            </main>
        );
    } //endif str_err



    if (!dic_conf) {
        return null;
    } //endif dic_conf



    return (
        <main className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

            <div className="relative mx-auto max-w-5xl px-6 py-16 text-zinc-100">
                <motion.div
                    initial={{ opacity:0, y:12 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-semibold italic text-center whitespace-pre-line">
                        {dic_conf.title ?? "Conference"}
                    </h1>

                    {dic_conf.subtitle ? (
                        <p className="mt-1 text-sm text-zinc-400">
                            {dic_conf.subtitle}
                        </p>
                    ) : null}

                    <div className="mt-4 flex gap-4 text-sm">
                        <a className="underline text-zinc-300" href="#program">
                            Program
                        </a>

                        <a className="underline text-zinc-300" href="#panelists">
                            Panelists
                        </a>
                    </div>
                </motion.div>



                <GlassPanel str_tint="purple" className="px-8 py-8">
                    <section id="program" className="scroll-mt-24">
                        {/*
                          <h2 className="text-xl font-semibold italic text-zinc-200">
                              Program
                          </h2>
                          */}


                          <div className="mt-4 text-zinc-200">
                            {dic_program_parsed ? (
                                <ConferenceProgram dic_program={dic_program_parsed} />
                            ) : md_program ? (
                                <MDrenderer md={md_program} />
                            ) : (
                                <p className="text-sm text-zinc-400">
                                    (No program markdown found in dic_conf.)
                                </p>
                            )}
                        </div>
                    </section>

                    <GlassPanel className="mx-auto my-8 max-w-md px-8 py-6">
                      <div className="flex items-center justify-center gap-6">
                        <Link
                          href="/"
                          className="inline-flex min-w-[120px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
                        >
                          Back
                        </Link>

                        <a
                          href={dic_conf?.dic_urls?.event || dic_conf?.dic_urls?.about || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-w-[120px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
                        >
                          Access
                        </a>
                      </div>
                    </GlassPanel>

                    <div className="my-10 border-t border-white/10" />

                    <section id="panelists" className="scroll-mt-24">
                        {/*
                          <h2 className="text-xl font-semibold italic text-zinc-200">
                              Panelists
                          </h2>
                          */}

                        <div className="mt-6">
                            {lis_speaker_names.length ? (
                                <Panelistas lis_speakernames={lis_speaker_names} />
                            ) : (
                                <p className="text-sm text-zinc-400">
                                    (No lis_speakernames found.)
                                </p>
                            )}
                        </div>
                    </section>
                </GlassPanel>


            </div>
        </main>
    );
} //endfun ConferencePage
