"use client";

import Link                             from "next/link";
import GlassPanel                       from "@/components/GlassPanel.jsx";

const str_cn_btn                        =
    "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 " +
    "px-6 py-2 text-sm text-zinc-200 transition " +
    "hover:bg-white/10 active:scale-[0.99] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const str_url_youtube_emb               = "https://www.youtube.com/embed/kzHEn_xy8r0";

export default function PreviewPage() {
    return (
        <main className="relative min-h-screen">
            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-zinc-100">
                <GlassPanel str_tint="purple" className="w-full max-w-5xl px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold">
                            Preview
                        </h1>
                    </div>
                    {/* End Header */}

                    {/* Video */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                        <div className="relative w-full" style={{ paddingTop:"56.25%" }}>
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={str_url_youtube_emb}
                                title="Conference preview video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>
                    {/* End Video */}

                    {/* Description */}
                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 px-6 py-5 backdrop-blur-sm shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                        <p className="text-sm leading-7 text-zinc-300">
                            This video contains excerpts from preliminary editions leading up to the conference,
                            offering a sense of its trajectory and development over time. It reflects the spirit of
                            the project as a space for academic dialogue between different parts of the public-active
                            sphere, bringing together scientific, clinical, and civic perspectives around Long COVID
                            and related debilitating conditions.
                        </p>
                    </div>
                    {/* End Description */}

                    {/* Back */}
                    <div className="mt-8 flex justify-center">
                        <Link className={str_cn_btn} href="/">
                            Back
                        </Link>
                    </div>
                    {/* End Back */}
                </GlassPanel>
            </div>
        </main>
    );
} //endfun PreviewPage
