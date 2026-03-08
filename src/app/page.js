"use client";

import Image                          from "next/image";
import Link                           from "next/link";
import { motion }                     from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import GlassPanel                     from "@/components/GlassPanel.jsx";
import Virusbglayer                   from "@/components/Virusbglayer.jsx";
import { fun_fetch }                  from "@/utils/front/mod_front.js";

const str_pdf_path                    = "/cartel congreso_LCDD2026.pdf";

const str_cn_btn                      =
    "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 " +
    "px-6 py-2 text-sm text-zinc-200 transition " +
    "hover:bg-white/10 active:scale-[0.99] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const str_cn_btn_wide                 = str_cn_btn + " w-full max-w-[160px]";



const arr_ticker_items                = [
    { type:"label", text:"organized by:" },
    { type:"logo",  src:"/logos/logo_org_regeneratics.svg", alt:"Regeneratics", title:"Regeneratics", str_cn:"h-5" },

    { type:"sep" },

    { type:"label", text:"supported by:" },
    { type:"logo",  src:"/logos/logo_apo_semg.jpg",     alt:"SEMG",      title:"Sociedad Española de Médicos Generales y de Familia" },
    { type:"logo",  src:"/logos/logo_apo_reicop.svg",   alt:"REiCOP",    title:"Red Española de Investigación en COVID Persistente" },
    { type:"logo",  src:"/logos/logo_apo_amacop.svg",   alt:"AMACOP",    title:"AMACOP" },
    { type:"logo",  src:"/logos/logo_apo_lceuskal.jpg", alt:"LC Euskal", title:"Long COVID Euskal Herria" },

    { type:"sep" },
];





const lis_bg_viruses                  = [
    {
        left                          : "5%",
        top                           : "8%",
        size                          : 220,
        opacity                       : 0.045,
        blur_px                       : 4,
        str_anim                      : "virusDriftA 42s ease-in-out infinite",
    },
    {
        right                         : "7%",
        top                           : "10%",
        size                          : 280,
        opacity                       : 0.04,
        blur_px                       : 7,
        str_anim                      : "virusDriftB 56s ease-in-out infinite",
    },
    {
        left                          : "8%",
        bottom                        : "10%",
        size                          : 250,
        opacity                       : 0.03,
        blur_px                       : 6,
        str_anim                      : "virusDriftC 49s ease-in-out infinite",
    },
    {
        right                         : "12%",
        bottom                        : "12%",
        size                          : 180,
        opacity                       : 0.04,
        blur_px                       : 3,
        str_anim                      : "virusDriftA 38s ease-in-out infinite",
    },
    {
        left                          : "44%",
        top                           : "14%",
        size                          : 140,
        opacity                       : 0.025,
        blur_px                       : 5,
        str_anim                      : "virusDriftB 34s ease-in-out infinite",
    },
];






function VirusSilhouette({ className = "" }) {
    return (
        <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className={className}
            fill="currentColor"
        >
            <circle cx="100" cy="100" r="42" />

            <circle cx="100" cy="18"  r="8" />
            <circle cx="100" cy="182" r="8" />
            <circle cx="18"  cy="100" r="8" />
            <circle cx="182" cy="100" r="8" />

            <circle cx="42"  cy="42"  r="8" />
            <circle cx="158" cy="42"  r="8" />
            <circle cx="42"  cy="158" r="8" />
            <circle cx="158" cy="158" r="8" />

            <circle cx="64"  cy="24"  r="7" />
            <circle cx="136" cy="24"  r="7" />
            <circle cx="64"  cy="176" r="7" />
            <circle cx="136" cy="176" r="7" />

            <circle cx="24"  cy="64"  r="7" />
            <circle cx="24"  cy="136" r="7" />
            <circle cx="176" cy="64"  r="7" />
            <circle cx="176" cy="136" r="7" />

            <rect x="96"  y="30"  width="8" height="22" rx="4" />
            <rect x="96"  y="148" width="8" height="22" rx="4" />
            <rect x="30"  y="96"  width="22" height="8" rx="4" />
            <rect x="148" y="96"  width="22" height="8" rx="4" />

            <rect x="49"  y="49"  width="8" height="18" rx="4" transform="rotate(-45 53 58)" />
            <rect x="143" y="49"  width="8" height="18" rx="4" transform="rotate(45 147 58)" />
            <rect x="49"  y="133" width="8" height="18" rx="4" transform="rotate(45 53 142)" />
            <rect x="143" y="133" width="8" height="18" rx="4" transform="rotate(-45 147 142)" />
        </svg>
    );
} //endfun VirusSilhouette

function BgViruses() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {lis_bg_viruses.map((dic_v, idx) => (
                <div
                    key={`virus_${idx}`}
                    className="absolute will-change-transform"
                    style={{
                        left                    : dic_v.left,
                        right                   : dic_v.right,
                        top                     : dic_v.top,
                        bottom                  : dic_v.bottom,
                        width                   : dic_v.size,
                        height                  : dic_v.size,
                        opacity                 : dic_v.opacity,
                        animation               : dic_v.str_anim,
                        transformOrigin         : "center center",
                    }}
                >
                    <VirusSilhouette
                        className="h-full w-full text-fuchsia-500"
                        style={{ filter:`blur(${dic_v.blur_px}px)` }}
                    />
                </div>
            ))}
        </div>
    );
} //endfun BgViruses







function TickerRow() {
    return (
        <div className="flex w-max shrink-0 items-center gap-8 pr-8">
            {arr_ticker_items.map((itm, idx) => {
                if (itm.type === "label") {
                    return (
                        <span
                            key={`label_${idx}`}
                            className="whitespace-nowrap text-[11px] uppercase tracking-[0.22em] text-zinc-300/75"
                        >
                            {itm.text}
                        </span>
                    );
                } //endif

                if (itm.type === "sep") {
                    return (
                        <span
                            key={`sep_${idx}`}
                            className="h-4 w-px shrink-0 bg-white/10"
                            aria-hidden="true"
                        />
                    );
                } //endif

                return (
                  <div
                    key={`logo_${idx}`}
                    className="flex h-8 items-center"
                    title={itm.title || itm.alt}
                  >
                    <Image
                        src={itm.src}
                        alt={itm.alt}
                        width={120}
                        height={32}
                        className={`${itm.str_cn || "h-6"} w-auto object-contain opacity-80`}
                    />
                  </div>
                );
            })}
        </div>
    );
} //endfun TickerRow







function fun_pick_conference(lsd_webinars = []) {
    const dic_by_slug                 = lsd_webinars.find(
        (dic_webinar) =>
            typeof dic_webinar?.slug === "string" &&
            dic_webinar.slug.startsWith("conf_")
    );

    if (dic_by_slug) {
        return dic_by_slug;
    } //endif

    const dic_by_about                = lsd_webinars.find(
        (dic_webinar) =>
            typeof dic_webinar?.dic_urls?.about === "string" &&
            dic_webinar.dic_urls.about.includes("conf_")
    );

    if (dic_by_about) {
        return dic_by_about;
    } //endif

    return null;
} //endfun fun_pick_conference





function fun_get_countdown_parts(str_starts_at, int_now_ms) {
    if (!str_starts_at) {
        return null;
    } //endif

    const int_target_ms               = new Date(str_starts_at).getTime();

    if (!Number.isFinite(int_target_ms)) {
        return null;
    } //endif

    const int_diff_ms                 = Math.max(0, int_target_ms - int_now_ms);

    const int_days                    = Math.floor(int_diff_ms / (1000 * 60 * 60 * 24));
    const int_hours                   = Math.floor((int_diff_ms / (1000 * 60 * 60)) % 24);
    const int_minutes                 = Math.floor((int_diff_ms / (1000 * 60)) % 60);
    const int_seconds                 = Math.floor((int_diff_ms / 1000) % 60);

    return {
        int_days,
        int_hours,
        int_minutes,
        int_seconds,
        boo_started                   : int_diff_ms <= 0,
    };
} //endfun fun_get_countdown_parts















export default function Home() {
    const [boo_copied, setCopied]     = useState(false);
    const [dic_conf, setConf]         = useState(null);
    const [int_now_ms, setNowMs]      = useState(Date.now());

    const dic_tim_ref                 = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const dic_out         = await fun_fetch({
                    str_api           : "/api/central",
                    str_fun           : "funbck_getwebinar",
                    dic               : { slug:"all" },
                });

                const lsd_webinars    = dic_out?.resp ?? [];
                const dic_conf_found  = fun_pick_conference(lsd_webinars);

                if (dic_conf_found) {
                    setConf(dic_conf_found);
                } //endif found
            } catch (err) {
                console.error("Home countdown load error:", err);
            } //endtry
        })();
    }, []);

    useEffect(() => {
        const int_interval            = setInterval(() => {
            setNowMs(Date.now());
        }, 1000);

        return () => clearInterval(int_interval);
    }, []);

    const dic_countdown               = useMemo(() => {
        return fun_get_countdown_parts(dic_conf?.startsAt, int_now_ms);
    }, [dic_conf?.startsAt, int_now_ms]);

    const fun_copy_home               = async () => {
        try {
            const str_url             =
                process.env.NEXT_PUBLIC_SITE_URL ||
                (typeof window !== "undefined" ? window.location.origin : "");

            await navigator.clipboard.writeText(str_url);

            setCopied(true);

            if (dic_tim_ref.current) {
                clearTimeout(dic_tim_ref.current);
            } //endif

            dic_tim_ref.current       = setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert("Copy failed. Try manually copying the URL from the address bar.");
        } //endtry
    }; //endfun fun_copy_home

    return (
        <main className="relative min-h-screen">
            {/* Fondo  <BgViruses /> */}
            <Virusbglayer />
            {/* End Fondo */}

            <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
                {/* Hero */}
                <motion.div
                    className="mb-10 flex flex-col items-center"
                    initial={{ opacity:0, y:8, scale:1.01 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    transition={{ duration:1.1, ease:"easeOut" }}
                >
                    {/* Hero image */}
                    <div className="select-none">
                        <Image
                            src="/hero.png"
                            alt="LCDD 2026 hero"
                            width={420}
                            height={420}
                            priority
                            className="h-auto w-[220px] sm:w-[300px] md:w-[380px] lg:w-[420px]"
                        />
                    </div>
                    {/* End Hero image */}
                </motion.div>
                {/* End Hero */}

                {/* Countdown */}
                {dic_countdown ? (
                    <motion.div
                        initial={{ opacity:0, y:8 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.7, delay:0.18 }}
                        className="mb-8"
                    >
                        {dic_countdown.boo_started ? (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                                Conference started
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <div className="min-w-[84px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-2xl font-bold text-zinc-100">
                                        {String(dic_countdown.int_days).padStart(2, "0")}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                                        Days
                                    </div>
                                </div>

                                <div className="min-w-[84px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-2xl font-bold text-zinc-100">
                                        {String(dic_countdown.int_hours).padStart(2, "0")}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                                        Hours
                                    </div>
                                </div>

                                <div className="min-w-[84px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-2xl font-bold text-zinc-100">
                                        {String(dic_countdown.int_minutes).padStart(2, "0")}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                                        Minutes
                                    </div>
                                </div>

                                {/* segundero solo display en desktop */}
                                <div className="hidden sm:block min-w-[84px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-2xl font-bold text-zinc-100">
                                        {String(dic_countdown.int_seconds).padStart(2, "0")}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                                        Seconds
                                    </div>
                                </div>

                            </div>
                        )}
                    </motion.div>
                ) : null}
                {/* End Countdown */}

                {/* Rotulo 2 lineas */}
                <motion.div
                    initial={{ opacity:0, y:10 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.7, delay:0.3 }}
                    className="mb-10"
                >
                    <div className="text-2xl font-semibold italic text-zinc-400">
                        International Online Conference
                    </div>

                    <div className="text-2xl font-semibold italic text-zinc-500">
                        Long COVID and Debilitating Diseases 2026
                    </div>
                </motion.div>
                {/* End Rotulo 2 lineas */}

                {/* ticker institucional */}
                <motion.div
                    initial={{ opacity:0, y:8 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.7, delay:0.45 }}
                    className="mb-10 w-full max-w-4xl overflow-hidden"
                >
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-0 py-3 backdrop-blur-sm">
                        <div className="relative overflow-hidden">
                            <div className="flex w-max items-center animate-[ticker_80s_linear_infinite]">
                                <TickerRow />
                                <TickerRow />
                                <TickerRow />
                                <TickerRow />
                            </div>
                        </div>
                    </div>
                </motion.div>
                {/* End ticker institucional */}

                {/* Panels */}
                <motion.div
                    className="w-full max-w-3xl space-y-6"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden          : {},
                        show            : {
                            transition  : {
                                staggerChildren : 0.14,
                                delayChildren   : 0.55,
                            },
                        },
                    }}
                >
                    {/* Panel 1 */}
                    <motion.div
                        variants={{
                            hidden      : { opacity:0, y:18 },
                            show        : { opacity:1, y:0 },
                        }}
                    >
                        <GlassPanel str_tint="purple" className="px-8 py-7">
                            <div className="grid grid-cols-2 place-items-center gap-x-8 gap-y-4">

                                <Link className={str_cn_btn_wide} href="/conference#program">
                                    Program
                                </Link>

                                <button className={str_cn_btn_wide} type="button" onClick={fun_copy_home}>
                                    {boo_copied ? "Copied!" : "Link to share"}
                                </button>

                                <Link className={str_cn_btn_wide} href="/conference#panelists">
                                    Panelists
                                </Link>

                                <a className={str_cn_btn_wide} href={str_pdf_path} download>
                                    PDF
                                </a>
                            </div>
                        </GlassPanel>
                    </motion.div>
                    {/* End Panel 1 */}

                    {/* Panel 2 */}
                    <motion.div
                        variants={{
                            hidden      : { opacity:0, y:18 },
                            show        : { opacity:1, y:0 },
                        }}
                    >
                        <GlassPanel str_tint="purple" className="px-8 py-7">
                            <div className="grid grid-cols-2 gap-6 sm:gap-8">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="min-h-[2.5rem] text-center text-[11px] italic leading-5 text-zinc-300 sm:min-h-0 sm:text-xs sm:text-zinc-400">
                                        Want to be panelist for 2027?
                                    </div>

                                    <Link className={str_cn_btn_wide} href="/register">
                                        Register
                                    </Link>
                                </div>

                                <div className="flex flex-col items-center gap-3">
                                    <div className="min-h-[2.5rem] text-center text-[11px] italic leading-5 text-zinc-300 sm:min-h-0 sm:text-xs sm:text-zinc-400">
                                        Doubts/Support/Others?
                                    </div>

                                    <Link className={str_cn_btn_wide} href="/contact">
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </GlassPanel>
                    </motion.div>
                    {/* End Panel 2 */}
                </motion.div>
                {/* End Panels */}
            </div>

            <style jsx>{`
                @keyframes ticker {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-25%);
                    }
                }

                @keyframes virusDriftA {
                    0%   { transform: translate3d(0px, 0px, 0) rotate(0deg) scale(1); }
                    25%  { transform: translate3d(14px, -10px, 0) rotate(4deg) scale(1.03); }
                    50%  { transform: translate3d(-8px, 12px, 0) rotate(-5deg) scale(0.98); }
                    75%  { transform: translate3d(10px, 6px, 0) rotate(2deg) scale(1.02); }
                    100% { transform: translate3d(0px, 0px, 0) rotate(0deg) scale(1); }
                }

                @keyframes virusDriftB {
                    0%   { transform: translate3d(0px, 0px, 0) rotate(0deg) scale(1); }
                    25%  { transform: translate3d(-12px, 8px, 0) rotate(-4deg) scale(1.02); }
                    50%  { transform: translate3d(16px, -10px, 0) rotate(5deg) scale(0.97); }
                    75%  { transform: translate3d(-6px, -4px, 0) rotate(-2deg) scale(1.01); }
                    100% { transform: translate3d(0px, 0px, 0) rotate(0deg) scale(1); }
                }

                @keyframes virusDriftC {
                    0%   { transform: translate3d(0px, 0px, 0) rotate(0deg) scale(1); }
                    25%  { transform: translate3d(8px, 12px, 0) rotate(3deg) scale(1.01); }
                    50%  { transform: translate3d(-14px, -8px, 0) rotate(-4deg) scale(0.98); }
                    75%  { transform: translate3d(12px, -6px, 0) rotate(2deg) scale(1.03); }
                    100% { transform: translate3d(0px, 0px, 0) rotate(0deg) scale(1); }
                }
            `}</style>
        </main>
    );
} //endfun Home
