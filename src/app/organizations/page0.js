"use client";

import Link                             from "next/link";
import GlassPanel                       from "@/components/GlassPanel.jsx";

const str_cn_btn                        =
    "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 " +
    "px-6 py-2 text-sm text-zinc-200 transition " +
    "hover:bg-white/10 active:scale-[0.99] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const lis_orgs                          = [
    {
        str_name                        : "SEMG",
        str_desc                        : "Spanish scientific society focused on general and family medicine, with strong activity in clinical training, research, and healthcare knowledge dissemination.",
        str_url                         : "https://semg.es/",
    },
    {
        str_name                        : "REiCOP",
        str_desc                        : "Spanish research network dedicated to advancing scientific knowledge on Long COVID and improving care for patients through research, consensus, and dissemination.",
        str_url                         : "https://reicop.org/",
    },
    {
        str_name                        : "AMACOP",
        str_desc                        : "Madrid-based patient association for people affected by Long COVID, focused on visibility, support, guidance, and accompaniment for patients and families.",
        str_url                         : "https://www.amacop.org/",
    },
    {
        str_name                        : "Long COVID Euskal Herria",
        str_desc                        : "Patient-led association in Euskal Herria working on visibility, community support, and advocacy around Long COVID and its social and healthcare impact.",
        str_url                         : "https://longcovideuskalherria.es/",
    },
    {
        str_name                        : "Movilización Persistente",
        str_desc                        : "Statewide civic platform of people affected by Long COVID and ME/CFS, focused on defending patients’ rights and access to quality healthcare.",
        str_url                         : "https://movilizacionpersistente.org/",
    },
]; //endlis lis_orgs

export default function OrganizationsPage() {
    return (
        <main className="relative min-h-screen">
            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-zinc-100">
                <GlassPanel str_tint="purple" className="w-full max-w-4xl px-8 py-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-semibold italic text-zinc-100">
                            Affiliated Organizations
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Institutions and organizations aligned with the scientific and social mission of the conference.
                        </p>
                    </div>
                    {/* End Header */}

                    {/* Organizations */}
                    <div className="space-y-5">
                        {lis_orgs.map((dic_org) => (
                            <GlassPanel
                                key={dic_org.str_name}
                                className="px-6 py-6"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-semibold text-zinc-100">
                                            {dic_org.str_name}
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                                            {dic_org.str_desc}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 justify-start md:justify-end">
                                        <a
                                            className={str_cn_btn}
                                            href={dic_org.str_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Visit website
                                        </a>
                                    </div>
                                </div>
                            </GlassPanel>
                        ))}
                    </div>
                    {/* End Organizations */}

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
} //endfun OrganizationsPage
