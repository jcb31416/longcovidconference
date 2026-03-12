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
                      <div className="text-sm leading-7 text-zinc-300 space-y-4">

                        <p>
                          This video features excerpts from early events that preceded the international online conference
                          <strong> LCDD (Long COVID and Debilitating Diseases)</strong>,
                          illustrating the evolution of the initiative and its commitment to
                          fostering dialogue across scientific, clinical, and civic perspectives
                          on Long COVID and related debilitating conditions.
                        </p>

                        <p>
                          <strong>Preliminary webinar (held in Spanish).</strong>
                        </p>

                        <div>
                          <strong>Speakers</strong>
                          <ul className="list-disc ml-6 mt-1">
                            <li>Ana Aguilar</li>
                            <li>Vicente Galarza</li>
                            <li>Manuel Ruiz (@manruipa)</li>
                            <li>Isabel Burnett</li>
                            <li>Andreas Hillebrand</li>
                            <li>Jose Crespo-Barrios, PhD</li>
                            <li>Niah Stewardson (pseudonym approved by the organization for duly justified reasons related to the panelist)</li>
                          </ul>
                        </div>

                        <div>
                          <strong>Organization</strong>
                          <ul className="list-disc ml-6 mt-1">
                            <li>regeneratics (speaker call and website)</li>
                            <li>Renegade Research (Zoom webinar hosting and facilitation)</li>
                          </ul>
                        </div>

                      </div>
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
