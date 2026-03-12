"use client";

import Image                            from "next/image";
import Link                             from "next/link";
import GlassPanel                       from "@/components/GlassPanel.jsx";

const str_cn_btn                        =
    "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 " +
    "px-6 py-2 text-sm text-zinc-200 transition " +
    "hover:bg-white/10 active:scale-[0.99] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const str_cn_subpanel                   =
    "rounded-2xl border border-white/10 bg-black/30 px-5 py-5 " +
    "backdrop-blur-sm shadow-[0_10px_24px_rgba(0,0,0,0.35)]";

const lis_orgs                          = [
    {
        str_name                        : "SEMG",
        str_desc                        : "Spanish scientific society focused on general and family medicine, with broad activity in clinical training, research, and dissemination of healthcare knowledge.",
        str_url                         : "https://semg.es/",
        str_logo                        : "/logos/logo_apo_semg.jpg",
        str_logo_alt                    : "SEMG logo",
    },
    {
        str_name                        : "REiCOP",
        str_desc                        : "Spanish research network dedicated to improving scientific knowledge on Long COVID and strengthening coordination between researchers and clinical practice.",
        str_url                         : "https://reicop.org/",
        str_logo                        : "/logos/logo_apo_reicop.svg",
        str_logo_alt                    : "REiCOP logo",
    },
    {
        str_name                        : "AMACOP",
        str_desc                        : "Patient association working on visibility, support, and advocacy for people affected by Long COVID, with a strong focus on guidance and community support.",
        str_url                         : "https://www.amacop.org/",
        str_logo                        : "/logos/logo_apo_amacop.svg",
        str_logo_alt                    : "AMACOP logo",
    },
    {
        str_name                        : "Long COVID Euskal Herria",
        str_desc                        : "Patient-led association in Euskal Herria focused on visibility, mutual support, and social and healthcare advocacy around Long COVID.",
        str_url                         : "https://longcovideuskalherria.es/",
        str_logo                        : "/logos/logo_apo_lceuskal.jpg",
        str_logo_alt                    : "Long COVID Euskal Herria logo",
    },
    {
        str_name                        : "Movilización Persistente",
        str_desc                        : "Statewide civic platform of people affected by persistent illness, promoting recognition, patients’ rights, and better access to healthcare and social support.",
        str_url                         : "https://movilizacionpersistente.org/",
        str_logo                        : "/logos/logo_movili.png",
        str_logo_alt                    : "Movilización Persistente logo",
    },
]; //endlis lis_orgs

function OrgCard({ dic_org }) {
    return (
        <div className={str_cn_subpanel}>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">

                {/* Logo */}
                <div className="flex shrink-0 items-center justify-center md:w-[120px]">
                    <div className="flex h-[72px] w-[120px] items-center justify-center rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                        <Image
                            src={dic_org.str_logo}
                            alt={dic_org.str_logo_alt}
                            width={140}
                            height={60}
                            className="max-h-[48px] w-auto object-contain opacity-90"
                        />
                    </div>
                </div>
                {/* End Logo */}

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-zinc-100">
                        {dic_org.str_name}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
                        {dic_org.str_desc}
                    </p>
                </div>
                {/* End Content */}

                {/* Action */}
                <div className="flex shrink-0 items-center md:justify-end">
                    {dic_org.str_url && dic_org.str_url !== "#" ? (
                        <a
                            className={str_cn_btn}
                            href={dic_org.str_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit website
                        </a>
                    ) : (
                        <button
                            className={str_cn_btn + " cursor-not-allowed opacity-60"}
                            type="button"
                            disabled
                        >
                            Website soon
                        </button>
                    )}
                </div>
                {/* End Action */}

            </div>
        </div>
    );
} //endfun OrgCard

export default function AffiliatedOrganizationsPage() {
    return (
        <main className="relative min-h-screen">
            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-zinc-100">
                <GlassPanel str_tint="purple" className="w-full max-w-5xl px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold">
                            Affiliated Organizations
                        </h1>

                        <p className="mt-1 text-sm text-zinc-400">
                            Organizations aligned with the scientific, clinical, and social mission of the conference.
                        </p>
                    </div>
                    {/* End Header */}

                    {/* Cards */}
                    <div className="space-y-4">
                        {lis_orgs.map((dic_org) => (
                            <OrgCard
                                key={dic_org.str_name}
                                dic_org={dic_org}
                            />
                        ))}
                    </div>
                    {/* End Cards */}

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
} //endfun AffiliatedOrganizationsPage
